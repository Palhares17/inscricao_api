import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AtividadeReacoes } from './atividade-reacoes.entity';

@Entity('atividade_reacao_categorias')
export class AtividadeReacaoCategorias extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('atividade_reacoes', 'atividade_reacao_categorias')
  avaliacao: AtividadeReacoes[];
}
