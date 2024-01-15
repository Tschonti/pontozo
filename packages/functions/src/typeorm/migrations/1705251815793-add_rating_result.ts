import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRatingResult1705251815793 implements MigrationInterface {
    name = 'AddRatingResult1705251815793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rating_result" ("id" int NOT NULL IDENTITY(1,1), "parentId" int, "eventId" int NOT NULL, "stageId" int, "criterionId" int, "categoryId" int, "items" nvarchar(255) NOT NULL, CONSTRAINT "PK_cdb2f177c64795e2c911de17df7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rating_result" ADD CONSTRAINT "FK_eacb4b10b2b33ef0648a264cd21" FOREIGN KEY ("parentId") REFERENCES "rating_result"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_result" ADD CONSTRAINT "FK_e1b3811b7603ca79f37c476dfc6" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_result" ADD CONSTRAINT "FK_637a0e96aa44f923e403b90bf4d" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_result" ADD CONSTRAINT "FK_b8e92010b73ef6b5d531066ddb9" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_result" ADD CONSTRAINT "FK_aac143e39399d12911644288a36" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating_result" DROP CONSTRAINT "FK_aac143e39399d12911644288a36"`);
        await queryRunner.query(`ALTER TABLE "rating_result" DROP CONSTRAINT "FK_b8e92010b73ef6b5d531066ddb9"`);
        await queryRunner.query(`ALTER TABLE "rating_result" DROP CONSTRAINT "FK_637a0e96aa44f923e403b90bf4d"`);
        await queryRunner.query(`ALTER TABLE "rating_result" DROP CONSTRAINT "FK_e1b3811b7603ca79f37c476dfc6"`);
        await queryRunner.query(`ALTER TABLE "rating_result" DROP CONSTRAINT "FK_eacb4b10b2b33ef0648a264cd21"`);
        await queryRunner.query(`DROP TABLE "rating_result"`);
    }

}
