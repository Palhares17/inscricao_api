import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ParticipanteAcoes } from './participante-acoes.entity';

@Entity('participante_acoes_categoria')
@Unique(['nome'])
export class ParticipanteAcoesCategoria extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('participante_acoes', 'participante_acoes_categoria')
  participanteAcoes: ParticipanteAcoes[];
}
