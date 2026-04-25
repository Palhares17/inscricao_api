import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ParticipanteDados } from './participante-dados.entity';

@Entity('participante_escolaridade_categorias')
@Unique(['nome'])
export class ParticipanteEscolaridadeCategorias extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('participante_dados', 'participante_escolaridade_categorias')
  participantesDados: ParticipanteDados[];
}
