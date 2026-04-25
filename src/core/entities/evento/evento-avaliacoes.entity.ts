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
import { Evento } from './evento.entity';
import { Participante } from '../participante/participante.entity';
import { Exclude } from 'class-transformer';

@Entity('evento_avaliacoes')
export class EventoAvaliacoes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nota: number;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  eventoId: string;

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
  @ManyToOne('participante', 'evento_avaliacoes')
  participante: Participante;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'evento_avaliacoes')
  evento: Evento;
}
