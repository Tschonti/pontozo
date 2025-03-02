import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEmailRecipientTable1740941432082 implements MigrationInterface {
  name = 'AddEmailRecipientTable1740941432082'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_recipient" ("userId" int NOT NULL, "email" nvarchar(255), "eventImportedNotifications" nvarchar(255) NOT NULL CONSTRAINT "DF_744b0ef22de17de67c58689a07e" DEFAULT 'ONLY_NATIONAL', "resultNotifications" nvarchar(255) NOT NULL CONSTRAINT "DF_13103553b8aebbcc0d877b613c7" DEFAULT 'ONLY_RATED', "restricted" bit NOT NULL CONSTRAINT "DF_44e4719c67d35c1fbe6c66ff889" DEFAULT 0, CONSTRAINT "CHK_8f0712760d831189f5a63fb5aa" CHECK (eventImportedNotifications in('NONE', 'ONLY_NATIONAL', 'ALL')), CONSTRAINT "CHK_b7174f9c985167c030ad3b0e9d" CHECK (resultNotifications in('NONE', 'ONLY_RATED', 'ALL')), CONSTRAINT "PK_3ebf863f72f32d77f115955f8e3" PRIMARY KEY ("userId"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "email_recipient"`)
  }
}
