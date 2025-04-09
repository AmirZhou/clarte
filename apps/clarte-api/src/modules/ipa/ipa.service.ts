import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IpaSymbol } from './entities/IpaSymbol.entity';
import { DictionaryEntry } from '../dictionary/entities/DictionaryEntry.entity';
import { DictionaryEntryExampleDto } from '../dictionary/dto/dictionary-entry-example.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class IpaService {
  constructor(
    @InjectRepository(IpaSymbol)
    private ipaSymbolRepository: Repository<IpaSymbol>,
    @InjectRepository(DictionaryEntry)
    private dictionaryEntryRepository: Repository<DictionaryEntry>,
  ) {}

  async findAll(): Promise<IpaSymbol[]> {
    return this.ipaSymbolRepository.find();
  }

  /**
   * Finds a random sample of dictionary entries containing the given IPA symbol.
   * WARNING: Uses ORDER BY RANDOM(), which can be slow on large datasets.
   */
  async findRandomDictionaryExamples(
    symbol: string,
    limit: number,
  ): Promise<DictionaryEntryExampleDto[]> {
    const ipaSymbol = await this.ipaSymbolRepository.findOne({
      where: { symbol },
      select: ['id', 'symbol'], // Only select ID
    });
    if (!ipaSymbol) {
      throw new NotFoundException(`IPA symbol '${symbol}' not found.`);
    }
    try {
      // Use QueryBuilder to join DictionaryEntry with IpaSymbol via the join table
      // and fetch a random sample.
      const entries = await this.dictionaryEntryRepository
        .createQueryBuilder('entry')
        // Join the ManyToMany relationship. TypeORM handles the join table details.
        // We use innerJoin because we ONLY want entries linked to *some* symbol.
        // The alias 'ipaSymbolRel' represents the IpaSymbol entity in the join context.
        .innerJoin('entry.ipaSymbols', 'ipaSymbolRel')
        // Filter where the joined IpaSymbol's ID matches the one we found.
        .where('ipaSymbolRel.id = :ipaSymbolId', { ipaSymbolId: ipaSymbol.id })
        // Select the specific fields needed for the DTO
        .select(['entry.id', 'entry.frenchEntry', 'entry.ipaNotation'])
        // Order randomly (DB specific function - RANDOM() for PostgreSQL/SQLite)
        .orderBy('RANDOM()')
        // Limit the number of results
        .limit(limit)
        // Execute the query
        .getMany(); // Use getMany to get mapped entities (selected fields only)

      // Map to DTOs if needed (getMany might return partial entities matching DTO shape)
      // Using instanceToPlain ensures only exposed properties (if using class-transformer) are returned
      // Or simply return 'entries' if the selected fields directly match the DTO shape
      return entries.map(
        (entry) => instanceToPlain(entry) as DictionaryEntryExampleDto,
      );
    } catch (error) {
      // Log the error for debugging
      console.error(
        `Error fetching random examples for symbol ${symbol}:`,
        error,
      );
      throw new InternalServerErrorException('Failed to fetch examples.');
    }
  }
}
