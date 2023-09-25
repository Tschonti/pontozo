import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRaterAge1695666298049 implements MigrationInterface {
  name = 'AddRaterAge1695666298049'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating" ADD "raterAge" int NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating" DROP COLUMN "raterAge"`)
  }
}
