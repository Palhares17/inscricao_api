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
import { QuestionarioPerguntaOpcoes } from './questionario-pergunta-opcoes.entity';
import { Participante } from '../../../core/entities/participante/participante.entity';
import { QuestionarioPerguntas } from './questionario-perguntas.entity';
import { Exclude } from 'class-transformer';

@Entity('questionario_resposta_participante')
export class QuestionarioRespostaParticipante extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  resposta: string;

  @Column({ nullable: true })
  opcaoEscolhidaId: string;

  @Column()
  @Exclude()
  participanteId: string;

  @Column()
  perguntaId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @JoinColumn({ name: 'opcaoEscolhidaId' })
  @ManyToOne(
    'questionario_pergunta_opcoes',
    'questionario_resposta_participante',
  )
  opcaoEscolhida: QuestionarioPerguntaOpcoes;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'questionario_resposta_participante')
  participante: Participante;

  @JoinColumn({ name: 'perguntaId' })
  @ManyToOne('questionario_perguntas', 'questionario_resposta_participante')
  pergunta: QuestionarioPerguntas;
}
