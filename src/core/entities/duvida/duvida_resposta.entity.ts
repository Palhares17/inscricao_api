import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Duvida } from './duvida.entity';
import { Exclude } from 'class-transformer';
import { ClienteOrganizadores } from '../cliente/cliente-organizadores.entity';

@Entity('duvida_resposta')
export class DuvidaResposta extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resposta: string;

  @Column()
  duvidaId: string;

  @Column()
  @Exclude()
  organizadorId: string;

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

  @JoinColumn({ name: 'organizadorId' })
  @ManyToOne('cliente_organizadores', 'duvida_resposta')
  organizador: ClienteOrganizadores;

  @JoinColumn({ name: 'duvidaId' })
  @OneToOne('duvida', 'duvida_resposta')
  duvida: Duvida;
}
