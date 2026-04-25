import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Atividade } from './atividade.entity';
import { Participante } from '../participante/participante.entity';
import { Exclude } from 'class-transformer';

@Entity('atividade_participante')
export class AtividadeParticipante extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  atividadeId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'atividade_participante')
  participante: Participante;

  @JoinColumn({ name: 'atividadeId' })
  @ManyToOne('atividade', 'atividade_participante')
  atividade: Atividade;
}
