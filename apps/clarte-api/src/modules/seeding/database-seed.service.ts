import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DictionaryEntry } from '../dictionary/entities/DictionaryEntry.entity';
import { IpaSymbol } from '../ipa/entities/IpaSymbol.entity';
import { EntityManager } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs/promises';
import { LanguageData, LanguageJson } from '../../types';
import GraphemeSplitter from 'grapheme-splitter';

@Injectable()
export class DatabaseSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeedService.name);

  constructor(
    // Inject EntityManager directly
    private readonly entityManager: EntityManager,
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
    // const hasEntries = await this.entryRepo.exists();
    // const hasIpaSymbols = await this.ipaRepo.exists();
    const hasEntries = await this.entityManager.exists(DictionaryEntry);
    const hasIpaSymbols = await this.entityManager.exists(IpaSymbol);
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
      const isProduction = process.env.NODE_ENV === 'production';
      const seedFileName = isProduction ? 'fr_FR.json' : 'fr_FR_tiny.json';
      const dataPath = path.join(process.cwd(), seedFileName);
      // const dataPath = path.join(process.cwd(), 'fr_FR.json');
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
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // execute queries using transactionalEntityManager
      this.logger.log('Starting transaction for data import.');
      // this line looks crazy, I can't the my head around it.
      const entriesToProcess: LanguageData[] = Object.entries(
        jsonData?.fr_FR ?? {},
      ).map(([key, value]) => ({ word: key, ipaNotation: value }));

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
          const newEntry = transactionalEntityManager.create(DictionaryEntry, {
            frenchEntry: word,
            ipaNotation: ipaNotation,
            length: word.length,
          });
          await transactionalEntityManager.save(DictionaryEntry, newEntry);
          const ipas = this.parseIpa(ipaNotation);
          await this.linkIpaSymbols(transactionalEntityManager, newEntry, ipas);
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
    });
    this.logger.log('Transaction committed successfully.');
  }
  private parseIpa(ipaNotation: string): string[] {
    const splitter = new GraphemeSplitter();

    const allSymbols = ipaNotation
      .split(',')
      .map((p) => p.trim().replace(/^\/|\/$/g, '')) // clean slashes
      .flatMap((cleaned) => splitter.splitGraphemes(cleaned));

    const unwantedSymbols = ['ː', '.', 'ʼ', ' '];
    const filteredSymbols = allSymbols.filter(
      (symbol) => !unwantedSymbols.includes(symbol),
    );
    return [...new Set(filteredSymbols)];
  }

  private async linkIpaSymbols(
    transactionalEntityManager: EntityManager,
    dictionEntry: DictionaryEntry,
    symbols: string[],
  ) {
    // 1. Get the unique symbols from the input array
    const uniqueSymbols = [...new Set(symbols)];
    this.logger.debug(
      `Entry: ${dictionEntry.frenchEntry}, Original symbols: ${symbols.length}, Unique symbols: ${uniqueSymbols.length}`,
    );

    const uniqueIpaEntities = await Promise.all(
      uniqueSymbols.map(async (symbol) => {
        let ipa = await transactionalEntityManager.findOne(IpaSymbol, {
          where: { symbol: symbol },
        });

        if (!ipa) {
          this.logger.debug(`Creating new IpaSymbol for: ${symbol}`);
          ipa = transactionalEntityManager.create(IpaSymbol, { symbol });
          await transactionalEntityManager.save(ipa);
        }
        return ipa;
      }),
    );
    const symbolMap = new Map<string, IpaSymbol>();
    uniqueIpaEntities.forEach((entity) => symbolMap.set(entity.symbol, entity));
    dictionEntry.ipaSymbols = uniqueSymbols
      .map((originalSymbol) => symbolMap.get(originalSymbol))
      .filter((entity): entity is IpaSymbol => entity !== undefined); // Filter out potential undefined if map failed
    await transactionalEntityManager.save(DictionaryEntry, dictionEntry);
  }
}
