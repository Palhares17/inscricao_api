import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Atividade } from './atividade.entity';
import { Participante } from '../participante/participante.entity';
import { Exclude } from 'class-transformer';
import { AtividadeComentarioRelevancia } from './atividade-comentario-relevancia.entity';

@Entity('atividade_comentarios')
export class AtividadeComentarios extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mensagem: string;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  atividadeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @ManyToOne(() => Atividade, (atividade) => atividade.comentarios)
  @JoinColumn({ name: 'atividadeId' })
  atividade: Atividade;

  @ManyToOne(
    () => Participante,
    (participante) => participante.comentariosAtividade,
  )
  @JoinColumn({ name: 'participanteId' })
  participante: Participante;

  @OneToMany(
    () => AtividadeComentarioRelevancia,
    (relevancia) => relevancia.comentario,
  )
  likes: AtividadeComentarioRelevancia[];
}
