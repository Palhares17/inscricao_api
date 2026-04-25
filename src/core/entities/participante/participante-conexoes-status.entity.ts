import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ParticipanteConexoes } from './participante-conexoes.entity';

@Entity('participante_conexoes_status')
@Unique(['nome'])
export class ParticipanteConexoesStatus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('participante_conexoes', 'participante_conexoes_status')
  conexoes: ParticipanteConexoes[];
}
