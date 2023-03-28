import { MigrationInterface, QueryRunner } from 'typeorm'

export class init1679948629543 implements MigrationInterface {
  name = 'init1679948629543'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "criterion" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "minValue" int NOT NULL, "maxValue" int NOT NULL, "weight" int NOT NULL, CONSTRAINT "PK_a69d2ffbb1ef3ebea02d895e92f" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "criterion"`)
  }
}
