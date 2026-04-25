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
import { ParticipanteAcoesCategoria } from './participante-acoes-categoria.entity';
import { Evento } from '../evento/evento.entity';
import { Participante } from '../participante/participante.entity';

@Entity('participante_acoes')
export class ParticipanteAcoes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  checked: boolean;

  @Column()
  eventoId: string;

  @Column()
  acaoCategoriaId: string;

  @Column()
  participanteId: string;

  @Column()
  entidadeId: string;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'participante_acoes')
  evento: Evento;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'participante_acoes')
  participante: Participante;

  @JoinColumn({ name: 'acaoCategoriaId' })
  @ManyToOne('participante_acoes_categoria', 'participante_acoes')
  participanteAcoesCategoria: ParticipanteAcoesCategoria;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
