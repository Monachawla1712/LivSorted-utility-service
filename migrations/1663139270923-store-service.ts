import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeService1663139270923 implements MigrationInterface {
  name = 'storeService1663139270923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE SCHEMA IF NOT EXISTS tools;
            CREATE TABLE "tools"."appconfigs" (
                "name" character varying NOT NULL,
                "config" json NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" character varying NOT NULL,
                CONSTRAINT "PK_ba0943758d17a11751976fdb22e" PRIMARY KEY ("name")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "tools"."appconfigs"
        `);
  }
}
