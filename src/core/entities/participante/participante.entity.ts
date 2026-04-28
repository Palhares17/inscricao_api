import { ParticipanteDados } from './participante-dados.entity';
import { ParticipanteAvatar } from './participante-avatar.entity';
import { AtividadeComentarios } from '../../../core/entities/atividade/atividade-comentarios.entity';
import { AtividadeParticipante } from '../../../core/entities/atividade/atividade-participante.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { MissaoParticipante } from 'src/core/entities/gamificacao/missao-participante.entity';
import { ParticipanteAcoes } from 'src/core/entities/gamificacao/participante-acoes.entity';
import { NumeroSorteio } from 'src/core/entities/gamificacao/numero-sorteio.entity';
import { EventoAvaliacoes } from '../evento/evento-avaliacoes.entity';
import { EventoComentarios } from '../evento/evento-comentarios.entity';
import { QuestionarioRespostaParticipante } from '../questionario/questionario-resposta-participante.entity';
import { EventoParticipante } from '../evento/evento-participante.entity';
import { Duvida } from '../duvida/duvida.entity';
import { DuvidaRelevancia } from '../duvida/duvida_relevancia.entity';
import { AtividadeReacoes } from '../atividade/atividade-reacoes.entity';
import { AtividadeComentarioRelevancia } from '../atividade/atividade-comentario-relevancia.entity';
import { TokenRecuperacaoSenha } from '../recuperacao/token-recuperacao-senha.entity';
import { QrCodeConfirmacaoPresenca } from '../qrcode/qrcode_confirmacao_presenca';
import { ParticipanteFCMToken } from './participante-fcm-token.entity';
import { ParticipanteConexoes } from './participante-conexoes.entity';
import { Inscricao } from '../inscricao/inscricao.entity';

@Entity('participante')
export class Participante extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ default: true })
  ativo: boolean;

  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt: Date;

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @Column()
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @OneToOne('participante_dados', 'participante')
  dados: ParticipanteDados;

  @OneToOne('participante_fcm_token', 'participante')
  fcmTokens: ParticipanteFCMToken;

  @OneToOne('participante_avatar', 'participante')
  avatar: ParticipanteAvatar;

  @OneToMany('atividade_reacoes', 'participante')
  avaliacoesAtividade: AtividadeReacoes[];

  @OneToMany('evento_avaliacoes', 'participante')
  avaliacoesEvento: EventoAvaliacoes[];

  @OneToMany('atividade_comentarios', 'participante')
  comentariosAtividade: AtividadeComentarios[];

  @OneToMany('evento_comentarios', 'participante')
  comentariosEvento: EventoComentarios[];

  @OneToMany('atividade_participante', 'participante')
  atividades: AtividadeParticipante[];

  @OneToMany('questionario_resposta_participante', 'participante')
  respostas: QuestionarioRespostaParticipante[];

  @OneToMany('evento_participantes', 'participante')
  eventos: EventoParticipante[];

  @OneToMany('duvida', 'participante')
  duvidas: Duvida[];

  @OneToMany('duvida_relevancia', 'participante')
  duvidaRelevancias: DuvidaRelevancia[];

  @OneToMany('missao_participante', 'participante')
  missoesParticipante: MissaoParticipante[];

  @OneToMany('participante_acoes', 'participante')
  participanteAcoes: ParticipanteAcoes[];

  @OneToMany('numero_sorteio', 'participante')
  sorteios: NumeroSorteio[];

  @OneToMany('atividade_comentario_relevancia', 'participante')
  likeComentarios: AtividadeComentarioRelevancia[];

  @OneToOne('participante', 'participante_avatar', { nullable: true })
  participanteAvatar: ParticipanteAvatar;

  @OneToMany(() => TokenRecuperacaoSenha, (token) => token.participante)
  tokensRecuperacaoSenha: TokenRecuperacaoSenha[];

  @OneToMany(
    () => QrCodeConfirmacaoPresenca,
    (qrCodeSala) => qrCodeSala.usuariosConfirmado,
  )
  qrCodeConfirmacoes: QrCodeConfirmacaoPresenca[];

  @OneToMany(
    () => ParticipanteConexoes,
    (participanteConexao) => participanteConexao.remetente,
  )
  conexoesEnviadas: Participante[];

  @OneToMany(
    () => ParticipanteConexoes,
    (participanteConexao) => participanteConexao.destinatario,
  )
  conexoesRecebidas: Participante[];

  @OneToMany(() => Inscricao, (inscricao) => inscricao.participante)
  inscricoes: Inscricao[];
}
