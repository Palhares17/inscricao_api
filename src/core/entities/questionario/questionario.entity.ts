import { Atividade } from '../../../core/entities/atividade/atividade.entity';
import { Evento } from '../../../core/entities/evento/evento.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionarioPerguntas } from './questionario-perguntas.entity';
import { Exclude } from 'class-transformer';
import { Tag } from '../tag/tag.entity';

@Entity('questionario')
export class Questionario extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column({ default: true })
  ativo: boolean;

  @Column()
  eventoId: string;

  @Column({ nullable: true })
  atividadeId: string;

  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt: Date;

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @Column()
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'questionario')
  evento: Evento;

  @JoinColumn({ name: 'atividadeId' })
  @ManyToOne('atividade', 'evento')
  atividade: Atividade;

  @OneToMany('questionario_perguntas', 'questionario')
  perguntas: QuestionarioPerguntas[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
