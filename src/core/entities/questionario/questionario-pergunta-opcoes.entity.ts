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
import { QuestionarioPerguntas } from './questionario-perguntas.entity';
import { QuestionarioRespostaParticipante } from './questionario-resposta-participante.entity';
import { Exclude } from 'class-transformer';

@Entity('questionario_pergunta_opcoes')
export class QuestionarioPerguntaOpcoes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  opcao: string;

  @Column()
  perguntaId: string;

  @CreateDateColumn()
  @Exclude()
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

  @ManyToOne(() => QuestionarioPerguntas, (pergunta) => pergunta.opcoes)
  @JoinColumn({ name: 'perguntaId' })
  pergunta: QuestionarioPerguntas;

  @OneToMany(
    () => QuestionarioRespostaParticipante,
    (resposta) => resposta.opcaoEscolhida,
  )
  questionarioRespostaParticipante: QuestionarioRespostaParticipante[];
}
