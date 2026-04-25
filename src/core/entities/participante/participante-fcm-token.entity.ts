import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Participante } from './participante.entity';
import { Exclude } from 'class-transformer';

@Entity('participante_fcm_token')
export class ParticipanteFCMToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  token: string;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: 'participanteId' })
  @OneToOne('participante', 'participante_fcm_token')
  participante: Participante;
}
