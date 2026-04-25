import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AtividadeComentarios } from './atividade-comentarios.entity';
import { Participante } from '../participante/participante.entity';

@Entity('atividade_comentario_relevancia')
export class AtividadeComentarioRelevancia extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  comentarioId: string;

  @Column()
  @Exclude()
  participanteId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @ManyToOne(() => Participante, (participante) => participante.likeComentarios)
  @JoinColumn({ name: 'participanteId' })
  participante: Participante;

  @ManyToOne(() => AtividadeComentarios, (comentario) => comentario.likes)
  @JoinColumn({ name: 'comentarioId' })
  comentario: AtividadeComentarios;
}
