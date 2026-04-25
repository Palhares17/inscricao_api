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

@Entity('evento_cache_version')
export class EventoCacheVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cacheVersion: number;

  @Column()
  eventoId: string;

  @JoinColumn({ name: 'eventoId' })
  @OneToOne('evento', 'evento_cache_version')
  evento: Evento;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
