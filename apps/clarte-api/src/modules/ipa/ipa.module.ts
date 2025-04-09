import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpaService } from './ipa.service';
import { IpaController } from './ipa.controller';
import { IpaSymbol } from './entities/IpaSymbol.entity';
import { SoundCategory } from './entities/SoundCategory.entity';
import { SoundSubcategory } from './entities/SoundSubcategory.entity';
import { Example } from './entities/Example.entity';
import { DictionaryEntry } from '../dictionary/entities/DictionaryEntry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IpaSymbol,
      SoundSubcategory,
      SoundCategory,
      Example,
      DictionaryEntry,
    ]),
  ],
  providers: [IpaService],
  controllers: [IpaController],
})
export class IpaModule {}
