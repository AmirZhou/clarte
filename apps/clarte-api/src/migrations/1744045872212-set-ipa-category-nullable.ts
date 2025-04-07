import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetIpaCategoryNullable1744045872212 implements MigrationInterface {
  name = 'SetIpaCategoryNullable1744045872212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" DROP CONSTRAINT "FK_916c93365d83118aba4baa2b9f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" ALTER COLUMN "subcategory_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" ADD CONSTRAINT "FK_916c93365d83118aba4baa2b9f0" FOREIGN KEY ("subcategory_id") REFERENCES "sound_subcategories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" DROP CONSTRAINT "FK_916c93365d83118aba4baa2b9f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" ALTER COLUMN "subcategory_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" ADD CONSTRAINT "FK_916c93365d83118aba4baa2b9f0" FOREIGN KEY ("subcategory_id") REFERENCES "sound_subcategories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }
}
