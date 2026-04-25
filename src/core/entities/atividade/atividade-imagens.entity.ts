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

@Entity('atividade_imagens')
export class AtividadeImagens extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  atividadeId: string;

  @Column()
  url: string;

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

  @JoinColumn({ name: 'atividadeId' })
  @ManyToOne('atividade', 'atividade_imagens')
  atividade: Atividade;
}
