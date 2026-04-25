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
import { Participante } from '../participante/participante.entity';
import { Evento } from './evento.entity';
import { Exclude } from 'class-transformer';

@Entity('evento_participantes')
export class EventoParticipante extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @ManyToOne('participante', 'evento_participantes')
  participante: Participante;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'evento_participantes')
  evento: Evento;
}
