import { Participante } from './participante/participante.entity';
import { Evento } from './evento/evento.entity';
import { EnderecoEvento } from './endereco/endereco-evento.entity';
import { EventoAvisos } from './evento/evento-avisos.entity';
import { EventoImagens } from './evento/evento-imagens.entity';
import { EventoComentarios } from './evento/evento-comentarios.entity';
import { EventoCacheVersion } from './evento/evento-cache-version.entity';
import { EventoAvaliacoes } from './evento/evento-avaliacoes.entity';
import { EventoPatrocinadores } from './evento/evento-patrocinadores.entity';
import { Atividade } from './atividade/atividade.entity';
import { AtividadeCategorias } from './atividade/atividade-categorias.entity';
import { AtividadeComentarios } from './atividade/atividade-comentarios.entity';
import { AtividadeImagens } from './atividade/atividade-imagens.entity';
import { Questionario } from './questionario/questionario.entity';
import { QuestionarioPerguntas } from './questionario/questionario-perguntas.entity';
import { QuestionarioPerguntaOpcoes } from './questionario/questionario-pergunta-opcoes.entity';
import { Cliente } from './cliente/cliente.entity';
import { ClienteDados } from './cliente/cliente-dados.entity';
import { ClienteOrganizadores } from './cliente/cliente-organizadores.entity';
import { ParticipanteDados } from './participante/participante-dados.entity';
import { ParticipanteAvatar } from './participante/participante-avatar.entity';
import { Duvida } from './duvida/duvida.entity';
import { DuvidaResposta } from './duvida/duvida_resposta.entity';
import { DuvidaRelevancia } from './duvida/duvida_relevancia.entity';
import { QuestionarioRespostaParticipante } from './questionario/questionario-resposta-participante.entity';
import { AtividadeParticipante } from './atividade/atividade-participante.entity';
import { EventoParticipante } from './evento/evento-participante.entity';
import { EnderecoEventoLugares } from './endereco/endereco-evento-lugares.entity';
import { ClienteCodigo } from './cliente/cliente-codigo.entity';
import { Tag } from './tag/tag.entity';
import { Gamificacao } from './gamificacao/gamificacao.entity';
import { Missao } from './gamificacao/missao.entity';
import { MissaoParticipante } from './gamificacao/missao-participante.entity';
import { NumeroSorteio } from './gamificacao/numero-sorteio.entity';
import { MissaoCategoria } from './gamificacao/missao-categoria.entity';
import { ParticipanteAcoes } from './gamificacao/participante-acoes.entity';
import { ParticipanteAcoesCategoria } from './gamificacao/participante-acoes-categoria.entity';
import { AtividadeReacaoCategorias } from './atividade/atividade-reacao-categorias.entity';
import { AtividadeReacoes } from './atividade/atividade-reacoes.entity';
import { AtividadeComentarioRelevancia } from './atividade/atividade-comentario-relevancia.entity';
import { NumeroSorteado } from './gamificacao/numero-sorteado.entity';
import { EventoPatrocinadoresImagem } from './evento/evento-patrocinadores-imagem.entity';
import { TokenRecuperacaoSenha } from './recuperacao/token-recuperacao-senha.entity';
import { EventoEstandes } from './evento/evento-estandes.entity';
import { EventoEstandesImagem } from './evento/evento-estandes-imagem.entity';
import { EventoEstandesDatas } from './evento/evento-estandes-datas.entity';
import { EventoComentariosSentimentos } from './evento/evento-comentarios-sentimentos.entity';
import { QrCodeSala } from './qrcode/qrcode_sala.entity';
import { QrCodeConfirmacaoPresenca } from './qrcode/qrcode_confirmacao_presenca';
import { QrCodeEstandePresenca } from './qrcode/qrcode_estande_presenca.entity';
import { AtividadeConfiguracoes } from './atividade/atividade-configuracoes';
import { ParticipanteFCMToken } from './participante/participante-fcm-token.entity';
import { ClienteOrganizadoresRoles } from './cliente/cliente-organizadores-roles.entity';
import { GaleriaImagem } from './galeria/galeria-imagem.entity';
import { ParticipanteAreasProfissionaisCategorias } from './participante/participante-areas-profissionais-categorias.entity';
import { ParticipanteEscolaridadeCategorias } from './participante/participante-escolaridade-categorias.entity';
import { ParticipanteConexoes } from './participante/participante-conexoes.entity';
import { ParticipanteConexoesStatus } from './participante/participante-conexoes-status.entity';
import { EventoConfiguracoes } from './evento/evento-configuracoes.entity';
import { GaleriaImagemStatus } from './galeria/galeria-imagem-status.entity';
import { GaleriaImagemDenuncia } from './galeria/galeria-imagem-denuncia.entity';
import { GaleriaImagemLike } from './galeria/galeria-imagem-like.entity';
import { EventoCodigo } from './evento/evento-codigo.entity';

export const entities = [
  TokenRecuperacaoSenha,
  Participante,
  ParticipanteDados,
  ParticipanteAvatar,
  EnderecoEvento,
  EnderecoEventoLugares,
  Evento,
  EventoAvisos,
  EventoImagens,
  EventoComentarios,
  EventoComentariosSentimentos,
  EventoAvaliacoes,
  EventoParticipante,
  EventoPatrocinadores,
  EventoPatrocinadoresImagem,
  EventoEstandes,
  EventoEstandesImagem,
  EventoEstandesDatas,
  EventoCacheVersion,
  EventoConfiguracoes,
  Atividade,
  AtividadeCategorias,
  AtividadeComentarios,
  AtividadeComentarioRelevancia,
  AtividadeReacoes,
  AtividadeReacaoCategorias,
  AtividadeParticipante,
  AtividadeImagens,
  AtividadeConfiguracoes,
  Tag,
  Questionario,
  QuestionarioPerguntas,
  QuestionarioPerguntaOpcoes,
  QuestionarioRespostaParticipante,
  Cliente,
  ClienteDados,
  ClienteOrganizadores,
  ClienteCodigo,
  Duvida,
  DuvidaResposta,
  DuvidaRelevancia,
  Gamificacao,
  Missao,
  MissaoParticipante,
  NumeroSorteio,
  NumeroSorteado,
  MissaoCategoria,
  ParticipanteAcoes,
  ParticipanteAcoesCategoria,
  QrCodeSala,
  QrCodeConfirmacaoPresenca,
  QrCodeEstandePresenca,
  ParticipanteFCMToken,
  ClienteOrganizadoresRoles,

  GaleriaImagem,
  GaleriaImagemStatus,
  GaleriaImagemDenuncia,
  GaleriaImagemLike,
  ParticipanteAreasProfissionaisCategorias,
  ParticipanteEscolaridadeCategorias,
  ParticipanteConexoes,
  ParticipanteConexoesStatus,

  EventoCodigo,
];
