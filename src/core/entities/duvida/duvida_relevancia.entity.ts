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
import { Duvida } from './duvida.entity';
import { Participante } from '../participante/participante.entity';
import { Exclude } from 'class-transformer';

@Entity('duvida_relevancia')
export class DuvidaRelevancia extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  duvidaId: string;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  @CreateDateColumn()
  @Exclude()
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

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'duvida_relevancia')
  participante: Participante;

  @JoinColumn({ name: 'duvidaId' })
  @ManyToOne('duvida', 'duvida_relevancia')
  duvida: Duvida;
}
