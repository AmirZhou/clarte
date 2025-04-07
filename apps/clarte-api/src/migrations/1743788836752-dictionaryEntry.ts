import { MigrationInterface, QueryRunner } from 'typeorm';

export class DictionaryEntry1743788836752 implements MigrationInterface {
  name = 'DictionaryEntry1743788836752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "dictionary_entries" ("id" SERIAL NOT NULL, "frenchEntry" character varying(255) NOT NULL, "ipaNotation" character varying(255) NOT NULL, "translation" text, "length" smallint, CONSTRAINT "UQ_a8463ed415bcad622adf731761e" UNIQUE ("frenchEntry"), CONSTRAINT "PK_47cac68f15abb2d1caa183960fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a8463ed415bcad622adf731761" ON "dictionary_entries" ("frenchEntry") `,
    );
    await queryRunner.query(
      `CREATE TABLE "dictionary_entry_ipa_symbols" ("entry_id" integer NOT NULL, "ipa_symbol_id" bigint NOT NULL, CONSTRAINT "PK_4d16d43a0acb99082cb95bd7d50" PRIMARY KEY ("entry_id", "ipa_symbol_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f4d15998f323c1140f28899957" ON "dictionary_entry_ipa_symbols" ("entry_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c95e2ce15513c117027649e77" ON "dictionary_entry_ipa_symbols" ("ipa_symbol_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entry_ipa_symbols" ADD CONSTRAINT "FK_f4d15998f323c1140f28899957d" FOREIGN KEY ("entry_id") REFERENCES "dictionary_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entry_ipa_symbols" ADD CONSTRAINT "FK_2c95e2ce15513c117027649e77c" FOREIGN KEY ("ipa_symbol_id") REFERENCES "ipa_symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "dictionary_entry_ipa_symbols" DROP CONSTRAINT "FK_2c95e2ce15513c117027649e77c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entry_ipa_symbols" DROP CONSTRAINT "FK_f4d15998f323c1140f28899957d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c95e2ce15513c117027649e77"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f4d15998f323c1140f28899957"`,
    );
    await queryRunner.query(`DROP TABLE "dictionary_entry_ipa_symbols"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a8463ed415bcad622adf731761"`,
    );
    await queryRunner.query(`DROP TABLE "dictionary_entries"`);
  }
}
