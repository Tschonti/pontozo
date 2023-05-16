import { MigrationInterface, QueryRunner } from "typeorm";

export class UraUpdate1684261944434 implements MigrationInterface {
    name = 'UraUpdate1684261944434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role_assignment" ADD "userFullName" nvarchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_role_assignment" ADD "userDOB" nvarchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role_assignment" DROP COLUMN "userDOB"`);
        await queryRunner.query(`ALTER TABLE "user_role_assignment" DROP COLUMN "userFullName"`);
    }

}
