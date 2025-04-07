import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IpaSymbol } from './entities/IpaSymbol.entity';

@Injectable()
export class IpaService {
  constructor(
    @InjectRepository(IpaSymbol)
    private ipaSymbolRepository: Repository<IpaSymbol>,
  ) {}

  findAll(): Promise<IpaSymbol[]> {
    return this.ipaSymbolRepository.find();
  }
}
