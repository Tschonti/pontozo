import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddInvalidatedState1711307184824 implements MigrationInterface {
  name = 'AddInvalidatedState1711307184824'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "CHK_0ab24dbc30d489f8fde0c108f4"`)
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "CHK_c4242a2bba095d32a38c436e82" CHECK (state in('RATEABLE', 'VALIDATING', 'ACCUMULATING', 'RESULTS_READY', 'INVALIDATED'))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "CHK_c4242a2bba095d32a38c436e82"`)
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "CHK_0ab24dbc30d489f8fde0c108f4" CHECK (([state]='RESULTS_READY' OR [state]='ACCUMULATING' OR [state]='VALIDATING' OR [state]='RATEABLE'))`
    )
  }
}
