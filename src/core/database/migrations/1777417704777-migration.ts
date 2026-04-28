import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777417704777 implements MigrationInterface {
    name = 'Migration1777417704777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inscricao_extra" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventoId" uuid NOT NULL, "nome" character varying(255) NOT NULL, "descricao" text, "gratuito" boolean NOT NULL, "preco" numeric(10,2), "vagas" integer NOT NULL, "vaiTerCertificado" boolean NOT NULL, "cargaHoraria" TIMESTAMP, "vagasUtilizadas" integer NOT NULL DEFAULT '0', "dataInicioDoExtra" TIMESTAMP NOT NULL, "dataFimDoExtra" TIMESTAMP NOT NULL, "dataInicioVenda" TIMESTAMP NOT NULL, "dataFimVenda" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a4f2056a5bc8020f10d156d0cab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inscricao_extra_participante" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "inscricaoId" uuid NOT NULL, "extraId" uuid NOT NULL, "credenciamentoRealizado" boolean NOT NULL DEFAULT false, "credenciamentoEm" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_inscricao_extra" UNIQUE ("inscricaoId", "extraId"), CONSTRAINT "PK_16bbb8823a1e1efacee4ab65735" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_iep_extra_id" ON "inscricao_extra_participante" ("extraId") `);
        await queryRunner.query(`CREATE INDEX "idx_iep_inscricao_id" ON "inscricao_extra_participante" ("inscricaoId") `);
        await queryRunner.query(`CREATE TABLE "certificado_modelo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventoId" uuid, "textoPersonalizado" text, "cargaHorariaFixa" integer, "ativo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_modelo_evento_id" UNIQUE ("eventoId"), CONSTRAINT "REL_b2517665192f96753913eaad16" UNIQUE ("eventoId"), CONSTRAINT "PK_21f102a07405f10a3f8c9c4ea92" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "certificado" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "inscricaoId" uuid NOT NULL, "modeloId" uuid NOT NULL, "codigoValidacao" character varying(64) NOT NULL, "emitidoEm" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_certificado_codigo" UNIQUE ("codigoValidacao"), CONSTRAINT "uq_certificado_inscricao_id" UNIQUE ("inscricaoId"), CONSTRAINT "REL_8d30ae7e8b66b6a0bc869d7ebc" UNIQUE ("inscricaoId"), CONSTRAINT "PK_aec6eed25d55c559a0f36fdad4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inscricao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventoId" uuid NOT NULL, "participanteId" uuid NOT NULL, "modalidadeId" uuid NOT NULL, "statusDoParticipante" character varying(20) NOT NULL, "expiraEm" TIMESTAMP, "qrCodeToken" character varying, "credenciamentoRealizado" boolean NOT NULL DEFAULT false, "credenciamentoEm" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_237259c9414662171b74c1afa97" UNIQUE ("qrCodeToken"), CONSTRAINT "uq_inscricao_evento_participante" UNIQUE ("eventoId", "participanteId"), CONSTRAINT "PK_c28e1e6a95a31f051e60b499382" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_inscricao_participante_id" ON "inscricao" ("participanteId") `);
        await queryRunner.query(`CREATE INDEX "idx_inscricao_evento_id" ON "inscricao" ("eventoId") `);
        await queryRunner.query(`CREATE TYPE "public"."inscricao_modalidade_metodospagamento_enum" AS ENUM('pix', 'boleto', 'credito', 'debito')`);
        await queryRunner.query(`CREATE TABLE "inscricao_modalidade" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventoId" uuid NOT NULL, "nome" character varying(255) NOT NULL, "descricao" text, "gratuito" boolean NOT NULL, "preco" numeric(10,2), "vagas" integer NOT NULL, "vagasUtilizadas" integer NOT NULL DEFAULT '0', "dataInicioVenda" TIMESTAMP NOT NULL, "dataFimVenda" TIMESTAMP NOT NULL, "documentosExigidos" text, "metodosPagamento" "public"."inscricao_modalidade_metodospagamento_enum" array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_50895837a4671f64e5c67400eed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_modalidade_evento_id" ON "inscricao_modalidade" ("eventoId") `);
        await queryRunner.query(`ALTER TABLE "inscricao_extra" ADD CONSTRAINT "FK_f60066d7f19218979bb24a8d52d" FOREIGN KEY ("eventoId") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao_extra_participante" ADD CONSTRAINT "FK_ae9a96326d3787ae1b62d22c9ea" FOREIGN KEY ("inscricaoId") REFERENCES "inscricao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao_extra_participante" ADD CONSTRAINT "FK_9717f1d9d82dca3473ebee71bcc" FOREIGN KEY ("extraId") REFERENCES "inscricao_extra"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificado_modelo" ADD CONSTRAINT "FK_b2517665192f96753913eaad169" FOREIGN KEY ("eventoId") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificado" ADD CONSTRAINT "FK_8d30ae7e8b66b6a0bc869d7ebc5" FOREIGN KEY ("inscricaoId") REFERENCES "inscricao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificado" ADD CONSTRAINT "FK_da29540fe63b0db836ea954755f" FOREIGN KEY ("modeloId") REFERENCES "certificado_modelo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD CONSTRAINT "FK_db02c0db17c8cbe211d9f929dd9" FOREIGN KEY ("eventoId") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD CONSTRAINT "FK_f81a6cfdfab7d939f61b25033c5" FOREIGN KEY ("participanteId") REFERENCES "participante"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao" ADD CONSTRAINT "FK_c2014cc34ad5e1562ed7025e9d0" FOREIGN KEY ("modalidadeId") REFERENCES "inscricao_modalidade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscricao_modalidade" ADD CONSTRAINT "FK_889000f6eede4a5b400b214af4a" FOREIGN KEY ("eventoId") REFERENCES "evento"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inscricao_modalidade" DROP CONSTRAINT "FK_889000f6eede4a5b400b214af4a"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP CONSTRAINT "FK_c2014cc34ad5e1562ed7025e9d0"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP CONSTRAINT "FK_f81a6cfdfab7d939f61b25033c5"`);
        await queryRunner.query(`ALTER TABLE "inscricao" DROP CONSTRAINT "FK_db02c0db17c8cbe211d9f929dd9"`);
        await queryRunner.query(`ALTER TABLE "certificado" DROP CONSTRAINT "FK_da29540fe63b0db836ea954755f"`);
        await queryRunner.query(`ALTER TABLE "certificado" DROP CONSTRAINT "FK_8d30ae7e8b66b6a0bc869d7ebc5"`);
        await queryRunner.query(`ALTER TABLE "certificado_modelo" DROP CONSTRAINT "FK_b2517665192f96753913eaad169"`);
        await queryRunner.query(`ALTER TABLE "inscricao_extra_participante" DROP CONSTRAINT "FK_9717f1d9d82dca3473ebee71bcc"`);
        await queryRunner.query(`ALTER TABLE "inscricao_extra_participante" DROP CONSTRAINT "FK_ae9a96326d3787ae1b62d22c9ea"`);
        await queryRunner.query(`ALTER TABLE "inscricao_extra" DROP CONSTRAINT "FK_f60066d7f19218979bb24a8d52d"`);
        await queryRunner.query(`DROP INDEX "public"."idx_modalidade_evento_id"`);
        await queryRunner.query(`DROP TABLE "inscricao_modalidade"`);
        await queryRunner.query(`DROP TYPE "public"."inscricao_modalidade_metodospagamento_enum"`);
        await queryRunner.query(`DROP INDEX "public"."idx_inscricao_evento_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_inscricao_participante_id"`);
        await queryRunner.query(`DROP TABLE "inscricao"`);
        await queryRunner.query(`DROP TABLE "certificado"`);
        await queryRunner.query(`DROP TABLE "certificado_modelo"`);
        await queryRunner.query(`DROP INDEX "public"."idx_iep_inscricao_id"`);
        await queryRunner.query(`DROP INDEX "public"."idx_iep_extra_id"`);
        await queryRunner.query(`DROP TABLE "inscricao_extra_participante"`);
        await queryRunner.query(`DROP TABLE "inscricao_extra"`);
    }

}
