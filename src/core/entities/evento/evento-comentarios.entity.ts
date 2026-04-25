import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Participante } from '../participante/participante.entity';
import { Exclude } from 'class-transformer';
import { EventoComentariosSentimentos } from './evento-comentarios-sentimentos.entity';

@Entity('evento_comentarios')
export class EventoComentarios extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mensagem: string;

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

  @Column({ default: 'null' })
  @DeleteDateColumn()
  @Exclude()
  deletedAt: string;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'evento_comentarios')
  evento: Evento;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'evento_comentarios')
  participante: Participante;

  @OneToOne('evento_comentarios_sentimentos', 'evento_comentarios')
  @JoinColumn()
  sentimentos: EventoComentariosSentimentos;
}
