import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IpaService {
  constructor(
    @InjectRepository(Word)
    private wordRepository: Repository<Word>,
  ) {}

  findAll(): Promise<Word[]> {
    return this.wordRepository.find();
  }
}
