// src/database/seeding/seeding.module.ts
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeedService } from './database-seed.service';
import { DictionaryEntry } from '../dictionary/entities/DictionaryEntry.Entity';
import { IpaSymbol } from '../ipa/entities/IpaSymbol.entity'; // Adjust path

@Module({
  imports: [
    // Import TypeOrmModule features needed for seeding
    TypeOrmModule.forFeature([DictionaryEntry, IpaSymbol]),
    // If SeedingService depends on services from other modules, import them here
    // e.g., DictionaryModule, IpaModule
  ],
  providers: [DatabaseSeedService, Logger], // Provide Logger if not global
  exports: [DatabaseSeedService], // Optional: if needed elsewhere
})
export class SeedingModule {}
