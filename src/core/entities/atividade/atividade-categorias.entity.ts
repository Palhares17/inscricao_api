import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Atividade } from './atividade.entity';

@Entity('atividade_categorias')
export class AtividadeCategorias extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('atividade', 'atividade_categorias')
  atividade: Atividade[];
}
