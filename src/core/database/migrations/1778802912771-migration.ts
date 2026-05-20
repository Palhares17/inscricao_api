import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1778802912771 implements MigrationInterface {
    name = 'Migration1778802912771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao" DROP CONSTRAINT "UQ_237259c9414662171b74c1afa97"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "qrCodeToken"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "qrCodeToken" uuid`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD CONSTRAINT "UQ_237259c9414662171b74c1afa97" UNIQUE ("qrCodeToken")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao" DROP CONSTRAINT "UQ_237259c9414662171b74c1afa97"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP COLUMN "qrCodeToken"`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD "qrCodeToken" character varying`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD CONSTRAINT "UQ_237259c9414662171b74c1afa97" UNIQUE ("qrCodeToken")`);
    }

}
