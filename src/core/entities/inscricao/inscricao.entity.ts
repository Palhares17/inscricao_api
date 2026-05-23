/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from '../evento/evento.entity';
import { Participante } from '../participante/participante.entity';
import { InscricaoModalidade } from './inscricao-modalidade.entity';
import { InscricaoExtraParticipante } from './inscricao-extra-participante.entity';
import { Certificado } from '../certificado/certificado.entity';

@Entity('inscricao')
@Unique('uq_inscricao_evento_participante', ['eventoId', 'participanteId'])
@Index('idx_inscricao_evento_id', ['eventoId'])
@Index('idx_inscricao_participante_id', ['participanteId'])
export class Inscricao extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventoId: string;

  @Column()
  participanteId: string;

  @Column()
  modalidadeId: string;

  @Column({ length: 20 })
  statusDoParticipante: string;

  @Column({ type: 'timestamp', nullable: true })
  expiraEm: Date;

  @Column('uuid', { unique: true, nullable: true })
  @Generated('uuid')
  qrCodeToken: string;

  @Column({ default: false })
  credenciamentoRealizado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  credenciamentoEm: Date | null;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne(() => Evento, (evento) => evento.inscricoes)
  evento: Evento;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne(() => Participante, (participante) => participante.inscricoes)
  participante: Participante;

  @JoinColumn({ name: 'modalidadeId' })
  @ManyToOne(() => InscricaoModalidade, (modalidade) => modalidade.inscricoes)
  modalidade: InscricaoModalidade;

  @OneToMany(
    () => InscricaoExtraParticipante,
    (participacao) => participacao.inscricao,
  )
  extras: InscricaoExtraParticipante[];

  @OneToOne(() => Certificado, (certificado) => certificado.inscricao)
  certificado: Certificado;
}
