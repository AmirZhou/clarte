// src/database/seeding/seeding.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictionaryEntry } from './entities/DictionaryEntry.entity';
import { IpaSymbol } from '../ipa/entities/IpaSymbol.entity'; // Adjust path

@Module({
  imports: [
    // Import TypeOrmModule features needed for seeding
    TypeOrmModule.forFeature([DictionaryEntry, IpaSymbol]),
    // If SeedingService depends on services from other modules, import them here
    // e.g., DictionaryModule, IpaModule
  ],
  providers: [], // Provide Logger if not global
  exports: [], // Optional: if needed elsewhere
})
export class DictionaryModule {}
