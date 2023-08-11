import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1691784848264 implements MigrationInterface {
  name = 'Init1691784848264'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "club" ("id" int NOT NULL, "code" nvarchar(255) NOT NULL, "shortName" nvarchar(255) NOT NULL, "longName" nvarchar(255) NOT NULL, CONSTRAINT "PK_79282481e036a6e0b180afa38aa" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "season_criterion_count" ("id" int NOT NULL IDENTITY(1,1), "seasonId" int NOT NULL, "role" nvarchar(255) NOT NULL, "eventSpecificAnyRank" int NOT NULL, "eventSpecificHigherRank" int NOT NULL, "stageSpecificAnyRank" int NOT NULL, "stageSpecificHigherRank" int NOT NULL, CONSTRAINT "UQ_37fab5df9ae17b25192afb3e56d" UNIQUE ("role", "seasonId"), CONSTRAINT "CHK_c5d71d561e8b099c3176a33ada" CHECK (role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')), CONSTRAINT "PK_913773a8459f5efd2d774a5b291" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "season_to_category" ("id" int NOT NULL IDENTITY(1,1), "order" int NOT NULL, "seasonId" int NOT NULL, "categoryId" int NOT NULL, CONSTRAINT "PK_53f43238d923588f7fbbf54e55d" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "season" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "startDate" datetime NOT NULL, "endDate" datetime NOT NULL, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "stage" ("id" int NOT NULL, "eventId" int NOT NULL, "startTime" nvarchar(255) NOT NULL, "endTime" nvarchar(255), "name" nvarchar(255) NOT NULL, "disciplineId" int NOT NULL, "rank" nvarchar(255) NOT NULL, CONSTRAINT "PK_c54d11b3c24a188262844af1612" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "event" ("id" int NOT NULL, "name" nvarchar(255) NOT NULL, "type" nvarchar(255) NOT NULL, "startDate" nvarchar(255) NOT NULL, "endDate" nvarchar(255), "rateable" bit NOT NULL CONSTRAINT "DF_60718ea2c6e6abd42b982dd321a" DEFAULT 1, "highestRank" nvarchar(255) NOT NULL, "seasonId" int NOT NULL, CONSTRAINT "CHK_3bb291fa6d94999112e1705565" CHECK (highestRank in('REGIONALIS', 'ORSZAGOS', 'KIEMELT')), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "event_rating" ("id" int NOT NULL IDENTITY(1,1), "eventId" int NOT NULL, "userId" int NOT NULL, "status" nvarchar(255) NOT NULL CONSTRAINT "DF_f8c358114813616d08d85c27b7f" DEFAULT 'STARTED', "role" nvarchar(255) NOT NULL, "createdAt" datetime NOT NULL, "submittedAt" datetime, CONSTRAINT "CHK_82d624f7a5000afa547fb1074a" CHECK (status in('STARTED', 'SUBMITTED')), CONSTRAINT "CHK_82e433ea50ec8088216a5e3a6f" CHECK (role in('COMPETITOR', 'COACH', 'ORGANISER', 'JURY')), CONSTRAINT "PK_cb8d706ff4a71549a49fde75a20" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "criterion_rating" ("id" int NOT NULL IDENTITY(1,1), "criterionId" int NOT NULL, "eventRatingId" int NOT NULL, "stageId" int, "value" int NOT NULL, CONSTRAINT "UQ_84ead6adbba5bb3768a3d8a2ec3" UNIQUE ("criterionId", "eventRatingId", "stageId"), CONSTRAINT "PK_a2f8174ca7ee0cefa32b4f7ccf9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "criterion" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, "text0" nvarchar(255), "text1" nvarchar(255), "text2" nvarchar(255), "text3" nvarchar(255), "editorsNote" nvarchar(255), "nationalOnly" bit NOT NULL, "stageSpecific" bit NOT NULL, "allowEmpty" bit NOT NULL, "competitorWeight" int, "organiserWeight" int, "roles" nvarchar(255) NOT NULL, CONSTRAINT "PK_a69d2ffbb1ef3ebea02d895e92f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "category_to_criterion" ("id" int NOT NULL IDENTITY(1,1), "order" int NOT NULL, "categoryId" int NOT NULL, "criterionId" int NOT NULL, CONSTRAINT "PK_06cb1ce0c2bb24a83bcafd7daca" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "category" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "description" nvarchar(255) NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_role_assignment" ("id" int NOT NULL IDENTITY(1,1), "userId" int NOT NULL, "role" nvarchar(255) NOT NULL, "userFullName" nvarchar(255) NOT NULL, "userDOB" nvarchar(255) NOT NULL, CONSTRAINT "UQ_e60f91440b001b4cbdb2735ee67" UNIQUE ("userId", "role"), CONSTRAINT "CHK_389f0cce0e7c869e711a889643" CHECK (role in('SITE_ADMIN', 'COACH', 'JURY')), CONSTRAINT "PK_9303e3c4641dfbe89462a7e72ea" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "event_organisers_club" ("eventId" int NOT NULL, "clubId" int NOT NULL, CONSTRAINT "PK_2959ede2ce4ce986bf20bf0efb0" PRIMARY KEY ("eventId", "clubId"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_af397ed122aee1fcb102f9bd0f" ON "event_organisers_club" ("eventId") `)
    await queryRunner.query(`CREATE INDEX "IDX_27861717dbffadcb3c9f98ae05" ON "event_organisers_club" ("clubId") `)
    await queryRunner.query(
      `ALTER TABLE "season_criterion_count" ADD CONSTRAINT "FK_123fd1216c5d8badbd03851b5ec" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "season_to_category" ADD CONSTRAINT "FK_6d938dcdc6eb86c2c9be1f13554" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "season_to_category" ADD CONSTRAINT "FK_2d1cbdefa3f619b2c996947004c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "stage" ADD CONSTRAINT "FK_644e369490c95b9a1af6adb54bf" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_ab9ee47c90697a08c32dd00859d" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event_rating" ADD CONSTRAINT "FK_d53f9a8b6f765e842a06e806bd8" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "criterion_rating" ADD CONSTRAINT "FK_923bceef7eba010505460f1a695" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "criterion_rating" ADD CONSTRAINT "FK_a0cc2d274aeee76989fa073e5c8" FOREIGN KEY ("eventRatingId") REFERENCES "event_rating"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "criterion_rating" ADD CONSTRAINT "FK_b3601dfe6e46802fbf0bf581419" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "category_to_criterion" ADD CONSTRAINT "FK_f865984330d9c0dd37cfe7afd51" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "category_to_criterion" ADD CONSTRAINT "FK_7338302c214c67f996dfcb9cc23" FOREIGN KEY ("criterionId") REFERENCES "criterion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "event_organisers_club" ADD CONSTRAINT "FK_af397ed122aee1fcb102f9bd0f0" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "event_organisers_club" ADD CONSTRAINT "FK_27861717dbffadcb3c9f98ae057" FOREIGN KEY ("clubId") REFERENCES "club"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_organisers_club" DROP CONSTRAINT "FK_27861717dbffadcb3c9f98ae057"`)
    await queryRunner.query(`ALTER TABLE "event_organisers_club" DROP CONSTRAINT "FK_af397ed122aee1fcb102f9bd0f0"`)
    await queryRunner.query(`ALTER TABLE "category_to_criterion" DROP CONSTRAINT "FK_7338302c214c67f996dfcb9cc23"`)
    await queryRunner.query(`ALTER TABLE "category_to_criterion" DROP CONSTRAINT "FK_f865984330d9c0dd37cfe7afd51"`)
    await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "FK_b3601dfe6e46802fbf0bf581419"`)
    await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "FK_a0cc2d274aeee76989fa073e5c8"`)
    await queryRunner.query(`ALTER TABLE "criterion_rating" DROP CONSTRAINT "FK_923bceef7eba010505460f1a695"`)
    await queryRunner.query(`ALTER TABLE "event_rating" DROP CONSTRAINT "FK_d53f9a8b6f765e842a06e806bd8"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_ab9ee47c90697a08c32dd00859d"`)
    await queryRunner.query(`ALTER TABLE "stage" DROP CONSTRAINT "FK_644e369490c95b9a1af6adb54bf"`)
    await queryRunner.query(`ALTER TABLE "season_to_category" DROP CONSTRAINT "FK_2d1cbdefa3f619b2c996947004c"`)
    await queryRunner.query(`ALTER TABLE "season_to_category" DROP CONSTRAINT "FK_6d938dcdc6eb86c2c9be1f13554"`)
    await queryRunner.query(`ALTER TABLE "season_criterion_count" DROP CONSTRAINT "FK_123fd1216c5d8badbd03851b5ec"`)
    await queryRunner.query(`DROP INDEX "IDX_27861717dbffadcb3c9f98ae05" ON "event_organisers_club"`)
    await queryRunner.query(`DROP INDEX "IDX_af397ed122aee1fcb102f9bd0f" ON "event_organisers_club"`)
    await queryRunner.query(`DROP TABLE "event_organisers_club"`)
    await queryRunner.query(`DROP TABLE "user_role_assignment"`)
    await queryRunner.query(`DROP TABLE "category"`)
    await queryRunner.query(`DROP TABLE "category_to_criterion"`)
    await queryRunner.query(`DROP TABLE "criterion"`)
    await queryRunner.query(`DROP TABLE "criterion_rating"`)
    await queryRunner.query(`DROP TABLE "event_rating"`)
    await queryRunner.query(`DROP TABLE "event"`)
    await queryRunner.query(`DROP TABLE "stage"`)
    await queryRunner.query(`DROP TABLE "season"`)
    await queryRunner.query(`DROP TABLE "season_to_category"`)
    await queryRunner.query(`DROP TABLE "season_criterion_count"`)
    await queryRunner.query(`DROP TABLE "club"`)
  }
}
