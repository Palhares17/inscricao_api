import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Participante } from '../participante/participante.entity';
import { GaleriaImagem } from './galeria-imagem.entity';

@Entity('galeria_imagem_like')
export class GaleriaImagemLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagemId: string;

  @Column()
  participanteId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdBy: string;

  @JoinColumn({ name: 'imagemId' })
  @ManyToOne('galeria_imagem', 'galeria_imagem_like')
  imagem: GaleriaImagem;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'galeria_imagem_like')
  participante: Participante;
}
