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
import { Participante } from './participante.entity';
import { Exclude } from 'class-transformer';
import { ParticipanteConexoesStatus } from './participante-conexoes-status.entity';

@Entity('participante_conexoes')
export class ParticipanteConexoes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  remetenteId: string;

  @Column()
  @Exclude()
  destinatarioId: string;

  @Column()
  @Exclude()
  statusId: string;

  @JoinColumn({ name: 'remetenteId' })
  @ManyToOne(
    () => Participante,
    (participante) => participante.conexoesEnviadas,
  )
  remetente: Participante;

  @JoinColumn({ name: 'destinatarioId' })
  @ManyToOne(
    () => Participante,
    (participante) => participante.conexoesRecebidas,
  )
  destinatario: Participante;

  @JoinColumn({ name: 'statusId' })
  @ManyToOne('participante_conexoes_status', 'participante_conexoes')
  status: ParticipanteConexoesStatus;

  @Column()
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @Column()
  @Exclude()
  updatedBy: string;
}
