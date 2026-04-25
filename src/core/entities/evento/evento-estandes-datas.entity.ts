import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventoEstandes } from './evento-estandes.entity';

@Entity('evento_estandes_datas')
export class EventoEstandesDatas extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  data: string;

  @Column()
  estandeId: string;

  @JoinColumn({ name: 'estandeId' })
  @ManyToOne(() => EventoEstandes, (estande) => estande.datas, {
    onDelete: 'CASCADE',
  })
  estande: EventoEstandes;
}
