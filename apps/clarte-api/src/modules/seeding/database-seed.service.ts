import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictionaryEntry } from '../dictionary/entities/DictionaryEntry.Entity';
import { IpaSymbol } from '../ipa/entities/IpaSymbol.entity';
import * as path from 'path';
import * as fs from 'fs/promises';
import { LanguageData, LanguageJson } from '../../types';

@Injectable()
export class DatabaseSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    @InjectRepository(DictionaryEntry)
    private readonly entryRepo: Repository<DictionaryEntry>,
    @InjectRepository(IpaSymbol)
    private readonly ipaRepo: Repository<IpaSymbol>,
    // Inject the EntityManager if you prefer using it for transactions directly // what do you mean tho
    // private readonly entityManager: EntityManager
  ) {}

  async onApplicationBootstrap() {
    this.logger.log(
      'Clarte: Application bootstrapped. Running seeding check...',
    );
    await this.seedDatabase();
  }

  private async shouldSeedDatabase(): Promise<boolean> {
    const forceSeed = process.env.FORCE_SEED === 'true';
    const seedEnabled = process.env.SEED_DATABASE !== 'false';

    if (forceSeed) {
      this.logger.log('FORCE_SEED is true. Seeding will run.');
      return true;
    }

    if (!seedEnabled) {
      this.logger.log('SEED_DATABASE is not true. Skipping seeding check.');
      return false;
    }

    // Check if data exists
    const hasEntries = await this.entryRepo.exists();
    const hasIpaSymbols = await this.ipaRepo.exists();

    if (hasEntries && hasIpaSymbols) {
      this.logger.log(
        'Database appears to be populated. Seeding will be skipped.',
      );
      return false;
    }

    this.logger.log(
      'Database is empty or SEED_DATABSE is true. Seeding will run.',
    );
    return true;
  }

  private async seedDatabase() {
    if (!(await this.shouldSeedDatabase())) {
      this.logger.log(
        'Database seeding skidpped based on configuration or existing data',
      );
      return;
    }

    this.logger.log('Starting database sedding process...');

    try {
      const dataPath = path.join(process.cwd(), 'fr_FR.json');
      this.logger.log(`Loading data from: ${dataPath}`);
      const rawData = await fs.readFile(dataPath, 'utf8');
      const jsonData = JSON.parse(rawData) as LanguageJson;
      this.logger.log('Data loaded. Starting import...');
      await this.importData(jsonData); // Use transaction wrapper
      this.logger.log('Database seeding completed successfully.');
    } catch (error) {
      // have to satisfy eslint here.
      // Default message in case it's not an Error instance
      let errorMessage = 'An unknown error occurred during seeding.';
      let errorStack: string | undefined = undefined; // Stack is optional

      // Check if the caught object is an actual Error
      if (error instanceof Error) {
        errorMessage = error.message; // Now safe to access
        errorStack = error.stack; // Now safe to access
        this.logger.error('Database seeding failed:', errorStack); // Log stack if available
      } else {
        // Log the error itself if it's not an Error instance (e.g., a string was thrown)
        this.logger.error(
          'Database seeding failed with a non-Error object:',
          error,
        );
        // Optionally try to convert the unknown error to a string
        errorMessage = String(error);
        // It's often good practice to always throw an actual Error object
        throw new Error(`Seeding failed: ${errorMessage}`);
      }
    }
  }

  private async importData(jsonData: LanguageJson) {
    await this.entryRepo.manager.transaction(
      async (transactionalEntityManager) => {
        // execute queries using transactionalEntityManager
        this.logger.log('Starting transaction for data import.');
        const entriesToProcess: LanguageData[] = Object.entries(
          jsonData?.fr_FR ?? {},
        ).map(([key, value]) => ({ [key]: value }));

        if (!entriesToProcess || entriesToProcess.length === 0) {
          this.logger.warn(
            'No valid entries found in the JSON data under fr_FR.',
          );
          return; // Or throw an error if data is expected
        }

        let processed = 0;
        const total = entriesToProcess.length;
        this.logger.log(`Found ${total} entries to process.`);

        for (const { word, ipaNotation } of entriesToProcess) {
          try {
            const newEntry = transactionalEntityManager.create(
              DictionaryEntry,
              {
                frenchEntry: word,
                ipaNotation: ipaNotation,
                length: word.length,
              },
            );
            await transactionalEntityManager.save(DictionaryEntry, newEntry);
            const ipas = this.parseIpa(ipaNotation);
            await this.linkIpaSymbols(newEntry, ipas);
            processed++;
            if (processed % 100 === 0 || processed === total) {
              this.logger.log(
                `Processed <span class="math-inline">${processed}/</span>{total} entries (${Math.round((processed / total) * 100)}%)`,
              );
            }
          } catch (error) {
            let detailedErrorMessage =
              'An unknown error occurred processing the entry.';
            if (error instanceof Error) {
              detailedErrorMessage = error.message; // Safe access
            } else {
              detailedErrorMessage = String(error); // Handle non-Error throws
            }
            this.logger.error(
              `Failed to process entry: [${word}, ${ipaNotation}]`,
              // Pass the extracted message as a separate argument to the logger
              detailedErrorMessage,
              // Optionally pass the original error's stack if available and it was an Error
              error instanceof Error ? error.stack : undefined,
            );
            // Throwing error here will automatically rollback the transaction
            throw error;
          }
        }
      },
    );
    this.logger.log('Transaction committed successfully.');
  }
  private parseIpa(ipaNotation: string): string[] {
    return [...ipaNotation.replace(/^\/|\/$/g, '')];
  }

  private async linkIpaSymbols(
    dictionEntry: DictionaryEntry,
    symbols: string[],
  ) {
    const ipaEntities = await Promise.all(
      symbols.map(async (symbol) => {
        let ipa = await this.ipaRepo.findOne({ where: { symbol: symbol } });

        if (!ipa) {
          ipa = this.ipaRepo.create({ symbol });
          await this.ipaRepo.save(ipa);
        }
        return ipa;
      }),
    );
    dictionEntry.ipaSymbols = ipaEntities;
    await this.entryRepo.save(dictionEntry);
  }
}
