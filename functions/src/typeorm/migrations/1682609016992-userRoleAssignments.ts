import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoleAssignments1682609016992 implements MigrationInterface {
    name = 'UserRoleAssignments1682609016992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_role_assignment" ("id" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "role" nvarchar(255) NOT NULL, CONSTRAINT "CHK_389f0cce0e7c869e711a889643" CHECK (role in('SITE_ADMIN', 'COACH', 'JURY')), CONSTRAINT "PK_9303e3c4641dfbe89462a7e72ea" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_role_assignment"`);
    }

}
