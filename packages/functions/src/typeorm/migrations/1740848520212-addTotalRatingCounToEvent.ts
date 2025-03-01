import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTotalRatingCounToEvent1740848520212 implements MigrationInterface {
  name = 'AddTotalRatingCounToEvent1740848520212'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" ADD "totalRatingCount" int NOT NULL CONSTRAINT "DF_47727a861270dc1689b5e3fc9bb" DEFAULT 0`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "DF_47727a861270dc1689b5e3fc9bb"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "totalRatingCount"`)
  }
}
