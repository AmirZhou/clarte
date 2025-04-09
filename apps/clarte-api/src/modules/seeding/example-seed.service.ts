// import { Injectable, Logger } from '@nestjs/common';
// import { EntityManager, In } from 'typeorm';
// import { DictionaryEntry } from '../dictionary/entities/DictionaryEntry.Entity';
// import { IpaSymbol } from '../ipa/entities/IpaSymbol.entity';
// import { Example } from '../ipa/entities/Example.entity';

// // this script is to populate the examples table,
// // which are some random subset of the following query (hard code 3, just for example)
// // intention is to provide more infomation, and to make the query faster
// //
// // SELECT *
// // FROM dictionary_entry_ipa_symbols dei
// // LEFT JOIN dictionary_entries de ON dei.entry_id = de.id
// // LEFT JOIN ipa_symbols ipas ON dei.ipa_symbol_id = ipas.id
// // WHERE dei.ipa_symbol_id = 3
// // ORDER BY RANDOM();
// interface RawEntryIdQueryResult {
//   entry_id: number;
//   // We don't strictly *need* the random value, but the query selects it for ordering
//   // random_sort_val: number;
// }
// @Injectable()
// export class ExampleSeedService implements OnApplicationBootstrap {
//   private readonly logger = new Logger(ExampleSeedService.name);

//   constructor(private readonly entityManager: EntityManager) {}

//   // async onApplicationBootstrap() {
//   //   this.logger.log(
//   //     'Clarte: Application bootstrapped. Running Example seeding check...',
//   //   );
//   // }

//   private async shouldSeedExamples(): Promise<boolean> {
//     const forceSeed = process.env.FORCE_SEED_EXAMPLES == 'true';

//     // Prerequisite Check: Dictionary and IPA symbols must exist
//     const hasDictionary = await this.entityManager.exists(DictionaryEntry);
//     const hasIpaSymbols = await this.entityManager.exists(IpaSymbol);

//     if (!hasDictionary || !hasIpaSymbols) {
//       this.logger.warn(
//         'Prerequisite data (Dictionary or IpaSymbols) not found. Skipping Example seeding.',
//       );
//       return false;
//     }

//     // Check if Examples already exist
//     const hasExamples = await this.entityManager.exists(Example);

//     if (hasExamples && !forceSeed) {
//       this.logger.log(
//         'Examples table appears to be populated and FORCE_SEED_EXAMPLES is not true. Skipping Example seeding.',
//       );
//       return false;
//     }
//     if (forceSeed) {
//       this.logger.log('FORCE_SEED_EXAMPLES is true. Example seeding will run.');
//       // Optionally, clear existing examples if forcing
//       this.logger.log(
//         'Clearing existing Examples due to FORCE_SEED_EXAMPLES=true...',
//       );
//       await this.entityManager.delete(Example, {}); // Clear all examples
//       this.logger.log('Existing Examples cleared.');
//     }

//     this.logger.log(
//       'Example table is empty or FORCE_SEED_EXAMPLES is true. Example seeding will run.',
//     );
//     return true;
//   }

//   private async populateExamplesFromDictionary() {
//     // get the transaction run everything inside it.
//     await this.entityManager.transaction(async (em) => {
//       // em = stands for the specify Entity Manager passed by the framework
//       this.logger.log('Starting transaction for Example population.');

//       const ipaSymbols = await em.find(IpaSymbol, {
//         select: ['id', 'symbol'],
//       });

//       if (!ipaSymbols || ipaSymbols.length === 0) {
//         this.logger.warn(
//           'No IPA symbols found in database. Cannot seed examples.',
//         );
//         return;
//       }
//       this.logger.log(`Found ${ipaSymbols.length} IPA symbols to process.`);
//       let totalExamplesCreated = 0;

//       for (const ipaSymbol of ipaSymbols) {
//         this.logger.debug(
//           `Processing symbol: ${ipaSymbol.symbol} (ID: ${ipaSymbol.id})`,
//         );
//         // Use raw query for ORDER BY RANDOM() as QueryBuilder can be tricky with it
//         // This query finds N random dictionary_entry IDs linked to the current symbol ID
//         // how to improve this performance? there're 250k entries, and 45 ipa_symbols
//         // const randomEntryIdSql = `
//         //   SELECT dei.entry_id
//         //   FROM dictionary_entry_ipa_symbols dei
//         //   WHERE dei.ipa_symbol_id = $1
//         //   ORDER BY RANDOM()
//         //   LIMIT $2;
//         // `;

//         try {
//           const results = em
//             .createQueryBuilder()
//             .select('dei.entry_id', 'entry_id')
//             .from('dictionary_entry_ipa_symbols', 'dei')
//             .where('dei.ipa_symbol_id = :ipaSymbolId', {
//               ipaSymbolId: ipaSymbol.id,
//             })
//             .addSelect('RANDOM()', 'random_sort_order')
//             .orderBy('random_sort_order', 'ASC')
//             .limit(150)
//             .getRawMany<RawEntryIdQueryResult>();
//           const entryIds: number[] = results.map((r) => r.entry_id);
//           if (entryIds.length === 0) {
//             this.logger.debug(
//               `No dictionary entries found for symbol ${ipaSymbol.symbol}.`,
//             );
//             continue; // Skip to next symbol
//           }
//         } catch (error) {
//           let detailedErrorMessage =
//             'An unknown error occurred processing the entry.';
//           if (error instanceof Error) {
//             detailedErrorMessage = error.message; // Safe access
//           } else {
//             detailedErrorMessage = String(error); // Handle non-Error throws
//           }
//           this.logger.error(
//             `Failed to process entry: `,
//             // Pass the extracted message as a separate argument to the logger
//             detailedErrorMessage,
//             // Optionally pass the original error's stack if available and it was an Error
//             error instanceof Error ? error.stack : undefined,
//           );
//           throw error;
//         }
//       }
//     });
//   }
// }
