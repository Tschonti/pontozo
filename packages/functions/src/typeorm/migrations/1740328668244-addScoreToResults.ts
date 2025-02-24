import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddScoreToResults1740328668244 implements MigrationInterface {
  name = 'AddScoreToResults1740328668244'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating_result" ADD "organiserWeight" real`)
    await queryRunner.query(`ALTER TABLE "rating_result" ADD "competitorWeight" real`)
    await queryRunner.query(`ALTER TABLE "rating_result" ADD "score" real NOT NULL`)
    await queryRunner.query(`ALTER TABLE "rating_result" ALTER COLUMN "items" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating_result" ALTER COLUMN "items" text NOT NULL`)
    await queryRunner.query(`ALTER TABLE "rating_result" DROP COLUMN "score"`)
    await queryRunner.query(`ALTER TABLE "rating_result" DROP COLUMN "competitorWeight"`)
    await queryRunner.query(`ALTER TABLE "rating_result" DROP COLUMN "organiserWeight"`)
  }
}
