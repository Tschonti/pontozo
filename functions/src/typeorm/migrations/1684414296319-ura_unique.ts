import { MigrationInterface, QueryRunner } from "typeorm";

export class UraUnique1684414296319 implements MigrationInterface {
    name = 'UraUnique1684414296319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role_assignment" ADD CONSTRAINT "UQ_e60f91440b001b4cbdb2735ee67" UNIQUE ("userId", "role")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_role_assignment" DROP CONSTRAINT "UQ_e60f91440b001b4cbdb2735ee67"`);
    }

}
