import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Evento } from './evento.entity';

@Entity('evento_configuracoes')
export class EventoConfiguracoes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventoId: string;

  @Column({ default: false })
  galeriaAtivada: boolean;

  @Column({ default: false })
  galeriaRequerCuradoria: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  updatedBy: string;

  @JoinColumn({ name: 'eventoId' })
  @OneToOne('evento', 'evento_configuracoes')
  evento: Evento;
}
