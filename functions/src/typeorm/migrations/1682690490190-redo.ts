import { MigrationInterface, QueryRunner } from "typeorm";

export class Redo1682690490190 implements MigrationInterface {
    name = 'Redo1682690490190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_rating" ("id" int NOT NULL IDENTITY(1,1), "eventId" int NOT NULL, "userId" int NOT NULL, "status" nvarchar(255) NOT NULL CONSTRAINT "DF_f8c358114813616d08d85c27b7f" DEFAULT 'STARTED', "role" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL, "submittedAt" datetime, CONSTRAINT "CHK_82d624f7a5000afa547fb1074a" CHECK (status in('STARTED', 'SUBMITTED')), CONSTRAINT "CHK_82e433ea50ec8088216a5e3a6f" CHECK (role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')), CONSTRAINT "PK_cb8d706ff4a71549a49fde75a20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "criterion_rating" ("id" int NOT NULL IDENTITY(1,1), "stageId" int, "value" int NOT NULL, "criterionId" int NOT NULL, "eventRatingId" int NOT NULL, CONSTRAINT "UQ_84ead6adbba5bb3768a3d8a2ec3" UNIQUE ("criterionId", "eventRatingId", "stageId"), CONSTRAINT "PK_a2f8174ca7ee0cefa32b4f7ccf9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "criterion" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "text0" nvarchar(255), "text1" nvarchar(255), "text2" nvarchar(255), "text3" nvarchar(255), "editorsNote" nvarchar(255), "nationalOnly" bit NOT NULL, "stageSpecific" bit NOT NULL, "competitorWeight" int, "organiserWeight" int, "roles" nvarchar(255) NOT NULL, CONSTRAINT "PK_a69d2ffbb1ef3ebea02d895e92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "season" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_role_assignment" ("id" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "role" nvarchar(255) NOT NULL, CONSTRAINT "CHK_389f0cce0e7c869e711a889643" CHECK (role in('SITE_ADMIN', 'COACH', 'JURY')), CONSTRAINT "PK_9303e3c4641dfbe89462a7e72ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_criteria_criterion" ("categoryId" int NOT NULL, "criterionId" int NOT NULL, CONSTRAINT "PK_5d3fb0bcd4345a36ae8925185fa" PRIMARY KEY ("categoryId", "criterionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5e0f67de9f84aee937c5dc23db" ON "category_criteria_criterion" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d1fef5e6148f0c2ad743f323f" ON "category_criteria_criterion" ("criterionId") `);
        await queryRunner.query(`CREATE TABLE "season_categories_category" ("seasonId" int NOT NULL, "categoryId" int NOT NULL, CONSTRAINT "PK_efb18121fd9e9345968c5d92f83" PRIMARY KEY ("seasonId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb2ac4713fb97ac0477c8434bc" ON "season_categories_category" ("seasonId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0563107c7515bed45f7460d5bb" ON "season_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD CONSTRAINT "FK_923bceef7eba010505460f1a695" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD CONSTRAINT "FK_a0cc2d274aeee76989fa073e5c8" FOREIGN KEY ("eventRatingId") REFERENCES "event_rating"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "FK_a0cc2d274aeee76989fa073e5c8"`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "FK_923bceef7eba010505460f1a695"`);
        await queryRunner.query(`DROP INDEX "IDX_0563107c7515bed45f7460d5bb" ON "season_categories_category"`);
        await queryRunner.query(`DROP INDEX "IDX_cb2ac4713fb97ac0477c8434bc" ON "season_categories_category"`);
        await queryRunner.query(`DROP TABLE "season_categories_category"`);
        await queryRunner.query(`DROP INDEX "IDX_8d1fef5e6148f0c2ad743f323f" ON "category_criteria_criterion"`);
        await queryRunner.query(`DROP INDEX "IDX_5e0f67de9f84aee937c5dc23db" ON "category_criteria_criterion"`);
        await queryRunner.query(`DROP TABLE "category_criteria_criterion"`);
        await queryRunner.query(`DROP TABLE "user_role_assignment"`);
        await queryRunner.query(`DROP TABLE "season"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "criterion"`);
        await queryRunner.query(`DROP TABLE "criterion_rating"`);
        await queryRunner.query(`DROP TABLE "event_rating"`);
    }

}
