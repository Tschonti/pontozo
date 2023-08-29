import { MigrationInterface, QueryRunner } from 'typeorm'

export class StagesToEventRating1693334031847 implements MigrationInterface {
  name = 'StagesToEventRating1693334031847'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_rating_stages_stage" ("eventRatingId" int NOT NULL, "stageId" int NOT NULL, CONSTRAINT "PK_71c788880263ffbb2a583921608" PRIMARY KEY ("eventRatingId", "stageId"))`
    )
    await queryRunner.query(`CREATE INDEX "IDX_3807102cdfd0b84a20ed81a334" ON "event_rating_stages_stage" ("eventRatingId") `)
    await queryRunner.query(`CREATE INDEX "IDX_1842a0b95587d9d93c1e522638" ON "event_rating_stages_stage" ("stageId") `)
    await queryRunner.query(
      `ALTER TABLE "event_rating_stages_stage" ADD CONSTRAINT "FK_3807102cdfd0b84a20ed81a3342" FOREIGN KEY ("eventRatingId") REFERENCES "event_rating"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "event_rating_stages_stage" ADD CONSTRAINT "FK_1842a0b95587d9d93c1e5226386" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event_rating_stages_stage" DROP CONSTRAINT "FK_1842a0b95587d9d93c1e5226386"`)
    await queryRunner.query(`ALTER TABLE "event_rating_stages_stage" DROP CONSTRAINT "FK_3807102cdfd0b84a20ed81a3342"`)
    await queryRunner.query(`DROP INDEX "IDX_1842a0b95587d9d93c1e522638" ON "event_rating_stages_stage"`)
    await queryRunner.query(`DROP INDEX "IDX_3807102cdfd0b84a20ed81a334" ON "event_rating_stages_stage"`)
    await queryRunner.query(`DROP TABLE "event_rating_stages_stage"`)
  }
}
