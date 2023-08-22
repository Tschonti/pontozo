import { MigrationInterface, QueryRunner } from 'typeorm'

export class RatingState1692730361523 implements MigrationInterface {
  name = 'RatingState1692730361523'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_rating" ADD "currentCategoryIdx" int NOT NULL CONSTRAINT "DF_795e2015ee5edbb2133086fbd4e" DEFAULT 0`
    )
    await queryRunner.query(
      `ALTER TABLE "event_rating" ADD "currentStageIdx" int NOT NULL CONSTRAINT "DF_d9ae5315623fb1f7876128c29e8" DEFAULT -1`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating" DROP CONSTRAINT "DF_d9ae5315623fb1f7876128c29e8"`)
    await queryRunner.query(`ALTER TABLE "event_rating" DROP COLUMN "currentStageIdx"`)
    await queryRunner.query(`ALTER TABLE "event_rating" DROP CONSTRAINT "DF_795e2015ee5edbb2133086fbd4e"`)
    await queryRunner.query(`ALTER TABLE "event_rating" DROP COLUMN "currentCategoryIdx"`)
  }
}
