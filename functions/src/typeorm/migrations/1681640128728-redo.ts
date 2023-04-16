import { MigrationInterface, QueryRunner } from "typeorm";

export class Redo1681640128728 implements MigrationInterface {
    name = 'Redo1681640128728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_rating" ("id" int NOT NULL IDENTITY(1,1), "eventId" int NOT NULL, "status" nvarchar(255) NOT NULL CONSTRAINT "DF_f8c358114813616d08d85c27b7f" DEFAULT 'STARTED', "role" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL, "submittedAt" datetime, CONSTRAINT "CHK_82d624f7a5000afa547fb1074a" CHECK (status in('STARTED', 'SUBMITTED')), CONSTRAINT "CHK_82e433ea50ec8088216a5e3a6f" CHECK (role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')), CONSTRAINT "PK_cb8d706ff4a71549a49fde75a20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "criterion_rating" ("id" int NOT NULL IDENTITY(1,1), "value" int NOT NULL, "criterionId" int NOT NULL, "eventRatingId" int NOT NULL, CONSTRAINT "UQ_580c78bef644d1b6596c64bad70" UNIQUE ("criterionId", "eventRatingId"), CONSTRAINT "PK_a2f8174ca7ee0cefa32b4f7ccf9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "criterion" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "text0" nvarchar(255), "text1" nvarchar(255), "text2" nvarchar(255), "text3" nvarchar(255), "editorsNote" nvarchar(255), "nationalOnly" bit NOT NULL, "stageSpecific" bit NOT NULL, "competitorWeight" int, "organiserWeight" int, "roles" nvarchar(255) NOT NULL, CONSTRAINT "PK_a69d2ffbb1ef3ebea02d895e92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD CONSTRAINT "FK_923bceef7eba010505460f1a695" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD CONSTRAINT "FK_a0cc2d274aeee76989fa073e5c8" FOREIGN KEY ("eventRatingId") REFERENCES "event_rating"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "FK_a0cc2d274aeee76989fa073e5c8"`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "FK_923bceef7eba010505460f1a695"`);
        await queryRunner.query(`DROP TABLE "criterion"`);
        await queryRunner.query(`DROP TABLE "criterion_rating"`);
        await queryRunner.query(`DROP TABLE "event_rating"`);
    }

}
