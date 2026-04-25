import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventoComentarios } from './evento-comentarios.entity';

@Entity('evento_comentarios_sentimentos')
export class EventoComentariosSentimentos extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  pos: number;

  @Column({ nullable: false })
  neu: number;

  @Column({ nullable: false })
  neg: number;

  @Column({ nullable: false })
  eventoComentarioId: string;

  @OneToOne('evento_comentarios', 'evento_comentarios_sentimentos')
  @JoinColumn()
  eventoComentario: EventoComentarios;
}
