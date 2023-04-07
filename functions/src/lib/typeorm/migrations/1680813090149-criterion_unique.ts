import { MigrationInterface, QueryRunner } from "typeorm";

export class criterionUnique1680813090149 implements MigrationInterface {
    name = 'criterionUnique1680813090149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criterion_rating" ADD CONSTRAINT "UQ_580c78bef644d1b6596c64bad70" UNIQUE ("criterionId", "eventRatingId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "UQ_580c78bef644d1b6596c64bad70"`);
    }

}
