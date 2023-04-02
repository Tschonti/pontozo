import { MigrationInterface, QueryRunner } from "typeorm";

export class rolesToCriterion1680440941456 implements MigrationInterface {
    name = 'rolesToCriterion1680440941456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criterion" ADD "roles" nvarchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "criterion" DROP COLUMN "roles"`);
    }

}
