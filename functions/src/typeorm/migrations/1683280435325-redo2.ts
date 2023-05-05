import { MigrationInterface, QueryRunner } from "typeorm";

export class Redo21683280435325 implements MigrationInterface {
    name = 'Redo21683280435325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_to_criterion" DROP CONSTRAINT "FK_7338302c214c67f996dfcb9cc23"`);
        await queryRunner.query(`ALTER TABLE "category_to_criterion" ADD CONSTRAINT "FK_7338302c214c67f996dfcb9cc23" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_to_criterion" DROP CONSTRAINT "FK_7338302c214c67f996dfcb9cc23"`);
        await queryRunner.query(`ALTER TABLE "category_to_criterion" ADD CONSTRAINT "FK_7338302c214c67f996dfcb9cc23" FOREIGN KEY ("criterionId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
