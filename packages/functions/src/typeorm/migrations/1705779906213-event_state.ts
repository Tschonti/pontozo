import { MigrationInterface, QueryRunner } from 'typeorm'

export class EventState1705779906213 implements MigrationInterface {
  name = 'EventState1705779906213'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`EXEC sp_rename "pontozo-dtu-db.dbo.event.rateable", "state"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "DF_60718ea2c6e6abd42b982dd321a"`)
    await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "DF_5bcb4691305a70a213f794665c2" DEFAULT 1 FOR "state"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "DF_5bcb4691305a70a213f794665c2"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "state"`)
    await queryRunner.query(
      `ALTER TABLE "event" ADD "state" nvarchar(255) NOT NULL CONSTRAINT "DF_5bcb4691305a70a213f794665c2" DEFAULT 'RATEABLE'`
    )
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "CHK_0ab24dbc30d489f8fde0c108f4" CHECK (state in('RATEABLE', 'VALIDATING', 'ACCUMULATING', 'RESULTS_READY'))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "CHK_0ab24dbc30d489f8fde0c108f4"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "DF_5bcb4691305a70a213f794665c2"`)
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "state"`)
    await queryRunner.query(`ALTER TABLE "event" ADD "state" bit NOT NULL`)
    await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "DF_5bcb4691305a70a213f794665c2" DEFAULT 1 FOR "state"`)
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "DF_5bcb4691305a70a213f794665c2"`)
    await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "DF_60718ea2c6e6abd42b982dd321a" DEFAULT 1 FOR "state"`)
    await queryRunner.query(`EXEC sp_rename "pontozo-dtu-db.dbo.event.state", "rateable"`)
  }
}
