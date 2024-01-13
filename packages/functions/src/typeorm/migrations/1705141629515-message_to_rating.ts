import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageToRating1705141629515 implements MigrationInterface {
    name = 'MessageToRating1705141629515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_rating" ADD "message" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_rating" DROP COLUMN "message"`);
    }

}
