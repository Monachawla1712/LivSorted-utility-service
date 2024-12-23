import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeService1670505557108 implements MigrationInterface {
  name = 'storeService1670505557108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs"
            ADD "id" SERIAL NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs" DROP CONSTRAINT "PK_ba0943758d17a11751976fdb22e"
        `);
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs"
            ADD CONSTRAINT "PK_86569ab42fb31fd67e9f88a8ea6" PRIMARY KEY ("id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs" DROP CONSTRAINT "PK_86569ab42fb31fd67e9f88a8ea6"
        `);
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs"
            ADD CONSTRAINT "PK_0e3f030457e2e7edcb79cff1676" PRIMARY KEY ("name", "id")
        `);
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs" DROP CONSTRAINT "PK_0e3f030457e2e7edcb79cff1676"
        `);
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs"
            ADD CONSTRAINT "PK_ba0943758d17a11751976fdb22e" PRIMARY KEY ("name")
        `);
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs" DROP COLUMN "id"
        `);
  }
}
