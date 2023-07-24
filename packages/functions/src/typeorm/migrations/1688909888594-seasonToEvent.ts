import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeasonToEvent1688909888594 implements MigrationInterface {
  name = 'SeasonToEvent1688909888594'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" ADD "seasonId" int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_ab9ee47c90697a08c32dd00859d" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ab9ee47c90697a08c32dd00859d"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "seasonId"`)
  }
}
