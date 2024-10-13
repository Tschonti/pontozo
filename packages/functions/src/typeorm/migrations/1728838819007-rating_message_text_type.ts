import { MigrationInterface, QueryRunner } from 'typeorm'

export class RatingMessageTextType1728838819007 implements MigrationInterface {
  name = 'RatingMessageTextType1728838819007'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating" ALTER COLUMN "message" nvarchar(max)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating" ALTER COLUMN "message" nvarchar(255)`)
  }
}
