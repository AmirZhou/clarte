import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IpaSymbol } from './entities/IpaSymbol.entity';
import { DictionaryEntry } from '../dictionary/entities/DictionaryEntry.entity';
import { plainToInstance } from 'class-transformer';

// Define this interface near your service or in a types file
interface RawExampleData {
  entry_id: number; // Likely named entry_id by getRawMany
  entry_french_entry: string; // Likely named entry_frenchEntry
  entry_ipa_notation: string; // Likely named entry_ipaNotation
  symbolId: number; // Your alias 'symbolId' should be used as the key here
}

@Injectable()
export class IpaService {
  constructor(
    @InjectRepository(IpaSymbol)
    private ipaSymbolRepository: Repository<IpaSymbol>,
    @InjectRepository(DictionaryEntry)
    private dictionaryEntryRepository: Repository<DictionaryEntry>,
  ) {}

  async findAll(
    withExamples: boolean = true,
    limit: number = 1,
  ): Promise<IpaSymbol[]> {
    // the channalge is the loaded relation wont be random, if load them directly.
    const symbols = await this.ipaSymbolRepository.find(); // this wont load relation by default unless it's set to be eager in Entity

    if (!withExamples || symbols.length === 0) {
      // Ensure dictionaryEntries is initialized (or handled by consumer) if needed
      symbols.forEach((s) => (s.dictionaryEntries = []));
      console.log('not include Examples');
      return symbols;
    }

    // 3. Get IDs of symbols for filtering examples
    const symbolIds = symbols.map((s) => s.id); // this becomes string, which is weird, symbols are entities. and id are atuo generated bigint

    try {
      const examples = await this.dictionaryEntryRepository
        .createQueryBuilder('entry')
        .innerJoin('entry.ipaSymbols', 'symbolRel')
        .select([
          'entry.id', // Select needed entry fields...
          'entry.frenchEntry',
          'entry.ipaNotation',
        ])
        .addSelect('symbolRel.id', 'symbolId')
        .where('symbolRel.id IN (:...symbolIds)', { symbolIds })
        .orderBy('RANDOM()')
        .getRawMany<RawExampleData>();

      // console.log(`Raw examples fetched: ${examples.length}`);

      const examplesBySymbolId = new Map<number, DictionaryEntry[]>();
      for (const raw of examples) {
        const currentSymbolId = raw.symbolId;
        const examplesForCurrentSymbol =
          examplesBySymbolId.get(currentSymbolId) ?? [];

        // ---- DEBUG 2: Check data being processed in loop 1 ----
        // console.log(
        //   `Processing raw: symbolId=${currentSymbolId}, entryId=${raw.entry_id}, current array length=${examplesForCurrentSymbol.length}`,
        // );

        if (!examplesBySymbolId.has(currentSymbolId)) {
          // console.log(currentSymbolId); // also number here
          examplesBySymbolId.set(currentSymbolId, examplesForCurrentSymbol);
        }
        if (examplesForCurrentSymbol.length < limit) {
          // ---- ADD THIS LOG ----
          // console.log('Inspecting raw data:', raw);
          // // Check the values for entry_frenchEntry and entry_ipaNotation here!
          const entryInstance = plainToInstance(DictionaryEntry, {
            id: raw.entry_id,
            frenchEntry: raw.entry_french_entry,
            ipaNotation: raw.entry_ipa_notation,
          });
          examplesForCurrentSymbol.push(entryInstance);
          // ---- DEBUG 3: Check push result (optional) ----
          // console.log(
          //   ` -> Pushed entry ${entryInstance.id} to symbol ${currentSymbolId}. New length: ${examplesForCurrentSymbol.length}`,
          // );
        } else {
          // ---- DEBUG 4: Check if limit is being hit too early ----
          // console.log(` -> Limit reached for symbol ${currentSymbolId}.`);
        }
      }
      // ---- DEBUG 5: Check the final state of the map ----
      // console.log('Final examplesBySymbolId Map:', examplesBySymbolId);

      // ---- DEBUG 6: Check the IDs you are trying to match ----
      // console.log(
      //   'Attaching to symbol IDs:',
      //   symbols.map((s) => s.id),
      // );
      for (const symbol of symbols) {
        symbol.dictionaryEntries = examplesBySymbolId.get(symbol.id) || []; // Assign the limited/randomized array
      }
      return symbols;
    } catch (error) {
      console.error(`Error fetching examples for multiple IPA symbols:`, error);
      throw new InternalServerErrorException(
        'Failed to fetch IPA symbols with examples.',
      );
    }
  }

  async findRandomDictionaryExamples(
    symbol: string,
    limit: number,
  ): Promise<DictionaryEntry[]> {
    const ipaSymbol = await this.ipaSymbolRepository.findOne({
      select: {
        id: true,
        symbol: true,
      },
      where: {
        symbol: symbol,
      },
    });
    if (!ipaSymbol) {
      throw new NotFoundException(`IPA symbol '${symbol}' not found.`);
    }
    try {
      const entries = await this.dictionaryEntryRepository
        .createQueryBuilder('entry')
        .innerJoin('entry.ipaSymbols', 'ipaSymbolRel')
        .where('ipaSymbolRel.id = :ipaSymbolId', { ipaSymbolId: ipaSymbol.id })
        .select(['entry.id', 'entry.frenchEntry', 'entry.ipaNotation'])
        .orderBy('RANDOM()')
        .limit(limit)
        .getMany(); // Use getMany to get mapped entities (selected fields only)
      return entries;
    } catch (error) {
      console.error(
        `Error fetching random examples for symbol ${symbol}:`,
        error,
      );
      throw new InternalServerErrorException('Failed to fetch examples.');
    }
  }
}
