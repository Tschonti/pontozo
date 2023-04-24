import { MigrationInterface, QueryRunner } from "typeorm";

export class DropDescSeason1682361305950 implements MigrationInterface {
    name = 'DropDescSeason1682361305950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "season" ADD "description" nvarchar(255) NOT NULL`);
    }

}
