import { MigrationInterface, QueryRunner } from 'typeorm'

export class CriteriaWeightTable1735297080260 implements MigrationInterface {
  name = 'CriteriaWeightTable1735297080260'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "criterion_weight" ("id" int NOT NULL IDENTITY(1,1), "criterionId" int NOT NULL, "seasonId" int NOT NULL, "competitorWeight" float, "organiserWeight" float, CONSTRAINT "PK_931219b82b601f8cfd132a0e9bc" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "criterion" DROP COLUMN "organiserWeight"`)
    await queryRunner.query(`ALTER TABLE "criterion" DROP COLUMN "competitorWeight"`)
    await queryRunner.query(
      `ALTER TABLE "criterion_weight" ADD CONSTRAINT "FK_4c39a30c291e91857db0cae5f1b" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "criterion_weight" ADD CONSTRAINT "FK_8db3b63a41ee88123ea3550345d" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "criterion_weight" DROP CONSTRAINT "FK_8db3b63a41ee88123ea3550345d"`)
    await queryRunner.query(`ALTER TABLE "criterion_weight" DROP CONSTRAINT "FK_4c39a30c291e91857db0cae5f1b"`)
    await queryRunner.query(`ALTER TABLE "criterion" ADD "competitorWeight" int`)
    await queryRunner.query(`ALTER TABLE "criterion" ADD "organiserWeight" int`)
    await queryRunner.query(`DROP TABLE "criterion_weight"`)
  }
}
