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

@Entity('participante_avatar')
export class ParticipanteAvatar extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  @Exclude()
  url: string;

  @Column('bytea')
  @Exclude()
  content: Uint8Array;

  @Column()
  tipo: string;

  @Column({ nullable: true })
  @Exclude()
  participanteId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @OneToOne('participante', 'participante_avatar')
  @JoinColumn({ name: 'participanteId' })
  participante: Participante;
}
