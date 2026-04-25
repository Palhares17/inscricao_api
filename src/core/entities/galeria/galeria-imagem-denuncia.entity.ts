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

@Entity('galeria_imagem_denuncia')
export class GaleriaImagemDenuncia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagemId: string;

  @Column()
  participanteId: string;

  @Column()
  mensagem: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdBy: string;

  @JoinColumn({ name: 'imagemId' })
  @ManyToOne('galeria_imagem', 'galeria_imagem_denuncia')
  imagem: GaleriaImagem;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'galeria_imagem_denuncia')
  participante: Participante;
}
