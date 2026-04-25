import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Participante } from '../participante/participante.entity';
import { Atividade } from '../atividade/atividade.entity';
import { Evento } from '../evento/evento.entity';
import { DuvidaRelevancia } from './duvida_relevancia.entity';
import { DuvidaResposta } from './duvida_resposta.entity';
import { Exclude } from 'class-transformer';

@Entity('duvida')
export class Duvida extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  duvida: string;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  eventoId: string;

  @Column({ nullable: true })
  atividadeId: string;

  @Column()
  @CreateDateColumn()
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

  @Column({ default: false })
  lida: boolean;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'duvida')
  evento: Evento;

  @JoinColumn({ name: 'atividadeId' })
  @ManyToOne('atividade', 'duvida')
  atividade: Atividade;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'duvida')
  participante: Participante;

  @OneToOne('duvida_resposta', 'duvida')
  resposta: DuvidaResposta[];

  @OneToMany('duvida_relevancia', 'duvida')
  duvidaRelevancia: DuvidaRelevancia[];
}
