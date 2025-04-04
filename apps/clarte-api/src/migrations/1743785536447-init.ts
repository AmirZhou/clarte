import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1743785536447 implements MigrationInterface {
  name = 'Init1743785536447';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topic" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "image_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_15f634a2dbf62a79bb726fc6158" UNIQUE ("name"), CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subtopic" ("id" integer NOT NULL, "name" character varying NOT NULL, "topic_id" integer, CONSTRAINT "PK_6e037933157b6ab1225d6b87ee4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assignment" ("id" integer NOT NULL, "name" character varying NOT NULL, "conversation_id" integer, CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversation" ("id" integer NOT NULL, "name" character varying NOT NULL, "difficulty_level" character varying, "audio_url" character varying, "subtopic_id" integer, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sentence" ("id" integer NOT NULL, "text" character varying NOT NULL, "audio_url" character varying, "sequence_number" integer NOT NULL, "conversation_id" integer, CONSTRAINT "PK_eed8b400064f053f70c004b83e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sound_categories" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ffc0ce903c2e016123bcfc6abdd" UNIQUE ("name"), CONSTRAINT "PK_4f3d51715f68da8eb184076706f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sound_subcategories" ("id" SERIAL NOT NULL, "category_id" integer NOT NULL, "name" character varying(100) NOT NULL, "description" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_5958813c4fb80d74a75089210e5" UNIQUE ("category_id", "name"), CONSTRAINT "PK_578e83bcf4f5a9c97af25e7c87a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "examples" ("id" BIGSERIAL NOT NULL, "ipa_symbol_id" bigint NOT NULL, "frenchText" character varying(512) NOT NULL, "englishTranslation" character varying(512), "s3_audio_key_example" character varying(1024), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ea56499b0a3a29593d3405080e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8fc28d41b67801b0960287961a" ON "examples" ("ipa_symbol_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "ipa_symbols" ("id" BIGSERIAL NOT NULL, "subcategory_id" integer NOT NULL, "symbol" character varying(20) NOT NULL, "description" text, "pronunciationGuide" text, "s3_audio_key_sound" character varying(1024), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e94804e32bcc719ef7a9158f4b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_916c93365d83118aba4baa2b9f" ON "ipa_symbols" ("subcategory_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_59f5b5f9b8da57c508df0e044d" ON "ipa_symbols" ("symbol") `,
    );
    await queryRunner.query(
      `ALTER TABLE "subtopic" ADD CONSTRAINT "FK_f32cae3f9dd4c299e44c6eab141" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_001d8078044913c7c8bcddf8770" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" ADD CONSTRAINT "FK_3849280a507f03a5ac257bdbf95" FOREIGN KEY ("subtopic_id") REFERENCES "subtopic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sentence" ADD CONSTRAINT "FK_17f137791149fc2ffefe6a8864c" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sound_subcategories" ADD CONSTRAINT "FK_2cac58a71886dee98a92683fcff" FOREIGN KEY ("category_id") REFERENCES "sound_categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "examples" ADD CONSTRAINT "FK_8fc28d41b67801b0960287961a7" FOREIGN KEY ("ipa_symbol_id") REFERENCES "ipa_symbols"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" ADD CONSTRAINT "FK_916c93365d83118aba4baa2b9f0" FOREIGN KEY ("subcategory_id") REFERENCES "sound_subcategories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "ipa_symbols" DROP CONSTRAINT "FK_916c93365d83118aba4baa2b9f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "examples" DROP CONSTRAINT "FK_8fc28d41b67801b0960287961a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sound_subcategories" DROP CONSTRAINT "FK_2cac58a71886dee98a92683fcff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sentence" DROP CONSTRAINT "FK_17f137791149fc2ffefe6a8864c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversation" DROP CONSTRAINT "FK_3849280a507f03a5ac257bdbf95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_001d8078044913c7c8bcddf8770"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subtopic" DROP CONSTRAINT "FK_f32cae3f9dd4c299e44c6eab141"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59f5b5f9b8da57c508df0e044d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_916c93365d83118aba4baa2b9f"`,
    );
    await queryRunner.query(`DROP TABLE "ipa_symbols"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8fc28d41b67801b0960287961a"`,
    );
    await queryRunner.query(`DROP TABLE "examples"`);
    await queryRunner.query(`DROP TABLE "sound_subcategories"`);
    await queryRunner.query(`DROP TABLE "sound_categories"`);
    await queryRunner.query(`DROP TABLE "sentence"`);
    await queryRunner.query(`DROP TABLE "conversation"`);
    await queryRunner.query(`DROP TABLE "assignment"`);
    await queryRunner.query(`DROP TABLE "subtopic"`);
    await queryRunner.query(`DROP TABLE "topic"`);
  }
}
