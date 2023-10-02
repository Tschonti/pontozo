import { MigrationInterface, QueryRunner } from 'typeorm'

export class UniqueEventForUser1696272553417 implements MigrationInterface {
  name = 'UniqueEventForUser1696272553417'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating" ADD CONSTRAINT "UQ_3318f7ef6d6ed0d3e5130fe3e22" UNIQUE ("eventId", "userId")`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating" DROP CONSTRAINT "UQ_3318f7ef6d6ed0d3e5130fe3e22"`)
  }
}
