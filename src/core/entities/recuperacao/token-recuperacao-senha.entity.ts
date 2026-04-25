import { Exclude } from 'class-transformer';
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

import { Participante } from '../participante/participante.entity';

@Entity('token_recuperacao_senha')
export class TokenRecuperacaoSenha extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ length: 5, unique: true }) // Token de 5 dígitos, único
  token: string;

  @Column()
  ativo: boolean;

  @Column()
  participanteId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => Participante,
    (participante) => participante.tokensRecuperacaoSenha,
  )
  @JoinColumn({ name: 'participanteId' })
  participante: Participante;
}
