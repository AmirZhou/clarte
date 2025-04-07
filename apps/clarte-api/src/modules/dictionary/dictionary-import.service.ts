// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { DictionaryEntry } from './entities/DictionaryEntry.Entity';
// import { IpaSymbol } from '../ipa/entities/IpaSymbol.entity';
// import { LanguageData } from '../../types';

// @Injectable()
// export class DictionaryImportService {
//   constructor(
//     @InjectRepository(DictionaryEntry)
//     private entryRepo: Repository<DictionaryEntry>,
//     @InjectRepository(IpaSymbol) private ipaRepo: Repository<IpaSymbol>,
//   ) {}

//   async importFromJson(phoneticMaps: LanguageData) {
//     for (const [french, ipaNotation] of Object.entries(phoneticMaps)) {
//       const dictionEntry = await this.entryRepo.save({
//         frenchEntry: french,
//         ipaNotation: ipaNotation,
//         length: french.length,
//       });

//       const ipas = this.parseIpa(ipaNotation);
//       await this.linkIpaSymbols(dictionEntry, ipas);
//     }
//   }

//   private parseIpa(ipaNotation: string): string[] {
//     return [...ipaNotation.replace(/^\/|\/$/g, '')];
//   }

//   private async linkIpaSymbols(
//     dictionEntry: DictionaryEntry,
//     symbols: string[],
//   ) {
//     const ipaEntities = await Promise.all(
//       symbols.map(async (symbol) => {
//         let ipa = await this.ipaRepo.findOne({ where: { symbol: symbol } });

//         if (!ipa) {
//           ipa = this.ipaRepo.create({ symbol });
//           await this.ipaRepo.save(ipa);
//         }
//         return ipa;
//       }),
//     );

//     dictionEntry.ipaSymbols = ipaEntities;
//     await this.entryRepo.save(dictionEntry);
//   }
// }
