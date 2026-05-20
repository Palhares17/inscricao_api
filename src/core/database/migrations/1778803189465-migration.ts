import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778803189465 implements MigrationInterface {
    name = 'Migration1778803189465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao" ALTER COLUMN "qrCodeToken" SET DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao" ALTER COLUMN "qrCodeToken" DROP DEFAULT`);
    }

}
