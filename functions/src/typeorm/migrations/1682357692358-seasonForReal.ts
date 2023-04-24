import { MigrationInterface, QueryRunner } from "typeorm";

export class SeasonForReal1682357692358 implements MigrationInterface {
    name = 'SeasonForReal1682357692358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "season" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_criteria_criterion" ("categoryId" int NOT NULL, "criterionId" int NOT NULL, CONSTRAINT "PK_5d3fb0bcd4345a36ae8925185fa" PRIMARY KEY ("categoryId", "criterionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5e0f67de9f84aee937c5dc23db" ON "category_criteria_criterion" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d1fef5e6148f0c2ad743f323f" ON "category_criteria_criterion" ("criterionId") `);
        await queryRunner.query(`CREATE TABLE "season_categories_category" ("seasonId" int NOT NULL, "categoryId" int NOT NULL, CONSTRAINT "PK_efb18121fd9e9345968c5d92f83" PRIMARY KEY ("seasonId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb2ac4713fb97ac0477c8434bc" ON "season_categories_category" ("seasonId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0563107c7515bed45f7460d5bb" ON "season_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "category_criteria_criterion" ADD CONSTRAINT "FK_5e0f67de9f84aee937c5dc23db7" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_criteria_criterion" ADD CONSTRAINT "FK_8d1fef5e6148f0c2ad743f323fe" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "season_categories_category" ADD CONSTRAINT "FK_cb2ac4713fb97ac0477c8434bcd" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "season_categories_category" ADD CONSTRAINT "FK_0563107c7515bed45f7460d5bb8" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "season_categories_category" DROP CONSTRAINT "FK_0563107c7515bed45f7460d5bb8"`);
        await queryRunner.query(`ALTER TABLE "season_categories_category" DROP CONSTRAINT "FK_cb2ac4713fb97ac0477c8434bcd"`);
        await queryRunner.query(`ALTER TABLE "category_criteria_criterion" DROP CONSTRAINT "FK_8d1fef5e6148f0c2ad743f323fe"`);
        await queryRunner.query(`ALTER TABLE "category_criteria_criterion" DROP CONSTRAINT "FK_5e0f67de9f84aee937c5dc23db7"`);
        await queryRunner.query(`DROP INDEX "IDX_0563107c7515bed45f7460d5bb" ON "season_categories_category"`);
        await queryRunner.query(`DROP INDEX "IDX_cb2ac4713fb97ac0477c8434bc" ON "season_categories_category"`);
        await queryRunner.query(`DROP TABLE "season_categories_category"`);
        await queryRunner.query(`DROP INDEX "IDX_8d1fef5e6148f0c2ad743f323f" ON "category_criteria_criterion"`);
        await queryRunner.query(`DROP INDEX "IDX_5e0f67de9f84aee937c5dc23db" ON "category_criteria_criterion"`);
        await queryRunner.query(`DROP TABLE "category_criteria_criterion"`);
        await queryRunner.query(`DROP TABLE "season"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
