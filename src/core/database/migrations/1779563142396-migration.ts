import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1779563142396 implements MigrationInterface {
    name = 'Migration1779563142396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao_extra" ADD "exigeCredenciamento" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao_extra" DROP COLUMN "exigeCredenciamento"`);
    }

}
