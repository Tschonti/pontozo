import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAlertTable1711394423616 implements MigrationInterface {
  name = 'AddAlertTable1711394423616'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "alert" ("id" int NOT NULL IDENTITY(1,1), "description" nvarchar(255) NOT NULL, "level" nvarchar(255) CONSTRAINT CHK_ee75bc5fba8375db39561dfc7b_ENUM CHECK(level IN ('INFO','WARN','ERROR')) NOT NULL, "timestamp" datetime2 NOT NULL CONSTRAINT "DF_1425c319fed1b6466b5084254f9" DEFAULT getdate(), CONSTRAINT "CHK_955146385b697896a85a873a29" CHECK (level in('INFO', 'WARN', 'ERROR')), CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "alert"`)
  }
}
