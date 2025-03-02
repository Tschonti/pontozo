import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCalculatedAtToEvents1740847926741 implements MigrationInterface {
  name = 'AddCalculatedAtToEvents1740847926741'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" ADD "scoresCalculatedAt" datetime`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "scoresCalculatedAt"`)
  }
}
