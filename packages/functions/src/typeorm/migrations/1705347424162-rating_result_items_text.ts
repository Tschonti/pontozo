import { MigrationInterface, QueryRunner } from "typeorm";

export class RatingResultItemsText1705347424162 implements MigrationInterface {
    name = 'RatingResultItemsText1705347424162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating_result" DROP COLUMN "items"`);
        await queryRunner.query(`ALTER TABLE "rating_result" ADD "items" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating_result" DROP COLUMN "items"`);
        await queryRunner.query(`ALTER TABLE "rating_result" ADD "items" nvarchar(255) NOT NULL`);
    }

}
