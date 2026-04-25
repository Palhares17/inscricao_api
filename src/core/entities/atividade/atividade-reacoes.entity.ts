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
import { Exclude } from 'class-transformer';
import { Participante } from '../participante/participante.entity';
import { AtividadeReacaoCategorias } from './atividade-reacao-categorias.entity';

@Entity('atividade_reacoes')
export class AtividadeReacoes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  atividadeId: string;

  @Column()
  reacaoCategoriaId: string;

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
  @ManyToOne('participante', 'atividade_reacoes')
  participante: Participante;

  @JoinColumn({ name: 'atividadeId' })
  @ManyToOne('atividade', 'atividade_reacoes')
  atividade: Atividade;

  @JoinColumn({ name: 'reacaoCategoriaId' })
  @ManyToOne('atividade_reacao_categorias', 'atividade_reacoes')
  categoria: AtividadeReacaoCategorias;
}
