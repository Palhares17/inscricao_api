import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Evento } from './evento.entity';

@Entity('evento_codigo')
export class EventoCodigo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 6 })
  codigo: string;

  @Column()
  eventoId: string;

  @Column({ default: false })
  ativo: boolean;

  @JoinColumn({ name: 'eventoId' })
  @OneToOne(() => Evento, (evento) => evento.codigo)
  evento: Evento;
}
