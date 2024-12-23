import { MigrationInterface, QueryRunner } from 'typeorm';

export class storeService1670483386538 implements MigrationInterface {
  name = 'storeService1670483386538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs"
            ADD "version" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "tools"."appconfigs" DROP COLUMN "version"
        `);
  }
}
