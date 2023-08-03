import { MigrationInterface, QueryRunner } from 'typeorm'

export class SeasonCriterionCount1691089489871 implements MigrationInterface {
  name = 'SeasonCriterionCount1691089489871'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "season_criterion_count" ("id" int NOT NULL IDENTITY(1,1), "seasonId" int NOT NULL, "role" nvarchar(255) NOT NULL, "eventSpecificAnyRank" int NOT NULL, "eventSpecificHigherRank" int NOT NULL, "stageSpecificAnyRank" int NOT NULL, "stageSpecificHigherRank" int NOT NULL, CONSTRAINT "UQ_37fab5df9ae17b25192afb3e56d" UNIQUE ("role", "seasonId"), CONSTRAINT "CHK_c5d71d561e8b099c3176a33ada" CHECK (role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')), CONSTRAINT "PK_913773a8459f5efd2d774a5b291" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "season_criterion_count" ADD CONSTRAINT "FK_123fd1216c5d8badbd03851b5ec" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "season_criterion_count" DROP CONSTRAINT "FK_123fd1216c5d8badbd03851b5ec"`)
    await queryRunner.query(`DROP TABLE "season_criterion_count"`)
  }
}
