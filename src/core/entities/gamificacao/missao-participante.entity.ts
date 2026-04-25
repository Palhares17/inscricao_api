import {
  Column,
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Missao } from './missao.entity';
import { Participante } from '../participante/participante.entity';
import { Exclude } from 'class-transformer';

@Entity('missao_participante')
export class MissaoParticipante extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  progresso: number;

  @Column()
  concluida: boolean;

  @Column('date')
  dia: string;

  @Column()
  participanteId: string;

  @Column()
  missaoId: string;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'missao_participante')
  participante: Participante;

  @ManyToOne(() => Missao, (missao) => missao.missoesParticipante, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'missaoId' })
  missao: Missao;

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
