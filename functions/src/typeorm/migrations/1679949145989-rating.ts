import { MigrationInterface, QueryRunner } from 'typeorm'

export class rating1679949145989 implements MigrationInterface {
  name = 'rating1679949145989'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rating" ("id" int NOT NULL IDENTITY(1,1), "value" int NOT NULL, "criterionId" int, CONSTRAINT "PK_ecda8ad32645327e4765b43649e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "rating" ADD CONSTRAINT "FK_ad1443c268e7084d1ae6a9f8c26" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rating" DROP CONSTRAINT "FK_ad1443c268e7084d1ae6a9f8c26"`)
    await queryRunner.query(`DROP TABLE "rating"`)
  }
}
