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
import { Questionario } from './questionario.entity';
import { QuestionarioPerguntaOpcoes } from './questionario-pergunta-opcoes.entity';
import { QuestionarioRespostaParticipante } from './questionario-resposta-participante.entity';
import { Exclude } from 'class-transformer';

@Entity('questionario_perguntas')
export class QuestionarioPerguntas extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pergunta: string;

  @Column({ default: false })
  aberta: boolean;

  @Column()
  questionarioId: string;

  @Column()
  tipoPerguntaId: string;

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

  @ManyToOne(() => Questionario, (questionario) => questionario.perguntas)
  @JoinColumn({ name: 'questionarioId' })
  questionario: Questionario;

  @OneToMany(() => QuestionarioPerguntaOpcoes, (opcao) => opcao.pergunta)
  opcoes: QuestionarioPerguntaOpcoes[];

  @OneToMany(
    () => QuestionarioRespostaParticipante,
    (resposta) => resposta.pergunta,
  )
  respostas: QuestionarioRespostaParticipante[];

  respostaParticipante?: QuestionarioRespostaParticipante | null;
}
