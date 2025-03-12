import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { IpaService } from './ipa.service';
import { IpaController } from './ipa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  providers: [IpaService],
  controllers: [IpaController],
})
export class IpaModule {}
