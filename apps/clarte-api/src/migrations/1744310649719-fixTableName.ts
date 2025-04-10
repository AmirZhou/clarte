import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTableName1744310649719 implements MigrationInterface {
  name = 'FixTableName1744310649719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a8463ed415bcad622adf731761"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" RENAME COLUMN "pronunciationGuide" TO "pronunciation_guide"`,
    );
    await queryRunner.query(`ALTER TABLE "examples" DROP COLUMN "frenchText"`);
    await queryRunner.query(
      `ALTER TABLE "examples" DROP COLUMN "englishTranslation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" DROP CONSTRAINT "UQ_a8463ed415bcad622adf731761e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" DROP COLUMN "frenchEntry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" DROP COLUMN "ipaNotation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "examples" ADD "french_text" character varying(512) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "examples" ADD "english_translation" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" ADD "french_entry" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" ADD CONSTRAINT "UQ_44f8842d5fa3aff54cf8b6b3799" UNIQUE ("french_entry")`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" ADD "ipa_notation" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44f8842d5fa3aff54cf8b6b379" ON "dictionary_entries" ("french_entry") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_44f8842d5fa3aff54cf8b6b379"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" DROP COLUMN "ipa_notation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" DROP CONSTRAINT "UQ_44f8842d5fa3aff54cf8b6b3799"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" DROP COLUMN "french_entry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "examples" DROP COLUMN "english_translation"`,
    );
    await queryRunner.query(`ALTER TABLE "examples" DROP COLUMN "french_text"`);
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" ADD "ipaNotation" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" ADD "frenchEntry" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dictionary_entries" ADD CONSTRAINT "UQ_a8463ed415bcad622adf731761e" UNIQUE ("frenchEntry")`,
    );
    await queryRunner.query(
      `ALTER TABLE "examples" ADD "englishTranslation" character varying(512)`,
    );
    await queryRunner.query(
      `ALTER TABLE "examples" ADD "frenchText" character varying(512) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" RENAME COLUMN "pronunciation_guide" TO "pronunciationGuide"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a8463ed415bcad622adf731761" ON "dictionary_entries" ("frenchEntry") `,
    );
  }
}
