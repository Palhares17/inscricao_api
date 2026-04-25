import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Exclude } from 'class-transformer';

@Entity('evento_avisos')
export class EventoAvisos extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mensagem: string;

  @Column()
  eventoId: string;

  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt: Date;

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

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'evento_avisos')
  evento: Evento;
}
