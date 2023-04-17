import { MigrationInterface, QueryRunner } from "typeorm";

export class StageIdUnique1681660884575 implements MigrationInterface {
    name = 'StageIdUnique1681660884575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "UQ_580c78bef644d1b6596c64bad70"`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD "stageId" int`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD CONSTRAINT "UQ_84ead6adbba5bb3768a3d8a2ec3" UNIQUE ("criterionId", "eventRatingId", "stageId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "UQ_84ead6adbba5bb3768a3d8a2ec3"`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP COLUMN "stageId"`);
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD CONSTRAINT "UQ_580c78bef644d1b6596c64bad70" UNIQUE ("criterionId", "eventRatingId")`);
    }

}
