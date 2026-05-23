import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Inscricao } from './inscricao.entity';
import { InscricaoExtra } from './inscricao-extra.entity';

@Entity('inscricao_extra_participante')
@Unique('uq_inscricao_extra', ['inscricaoId', 'extraId'])
@Index('idx_iep_inscricao_id', ['inscricaoId'])
@Index('idx_iep_extra_id', ['extraId'])
export class InscricaoExtraParticipante extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inscricaoId: string;

  @Column()
  extraId: string;

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

  @JoinColumn({ name: 'inscricaoId' })
  @ManyToOne(() => Inscricao, (inscricao) => inscricao.extras)
  inscricao: Inscricao;

  @JoinColumn({ name: 'extraId' })
  @ManyToOne(() => InscricaoExtra, (extra) => extra.participacoes)
  extra: InscricaoExtra;
}
