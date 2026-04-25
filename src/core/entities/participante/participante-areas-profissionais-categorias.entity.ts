import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ParticipanteDados } from './participante-dados.entity';

@Entity('participante_areas_profissionais_categorias')
@Unique(['nome'])
export class ParticipanteAreasProfissionaisCategorias extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany(
    'participante_dados',
    'participante_areas_profissionais_categorias',
  )
  participantesDados: ParticipanteDados[];
}
