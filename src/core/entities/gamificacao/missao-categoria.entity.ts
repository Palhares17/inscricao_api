import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Missao } from './missao.entity';

@Entity('missao_categoria')
@Unique(['nome'])
export class MissaoCategoria extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('missao', 'missao_categoria')
  missoes: Missao[];
}
