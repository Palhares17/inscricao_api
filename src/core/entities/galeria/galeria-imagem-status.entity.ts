import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { GaleriaImagem } from './galeria-imagem.entity';

@Entity('galeria_imagem_status')
@Unique(['nome'])
export class GaleriaImagemStatus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('galeria_imagem', 'galeria_imagem_status')
  imagem: GaleriaImagem;
}
