import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventoImagens } from './evento-imagens.entity';
import { EnderecoEvento } from '../endereco/endereco-evento.entity';
import { EventoAvisos } from './evento-avisos.entity';
import { EventoParticipante } from './evento-participante.entity';
import { EventoAvaliacoes } from './evento-avaliacoes.entity';
import { EventoComentarios } from './evento-comentarios.entity';
import { EventoPatrocinadores } from './evento-patrocinadores.entity';
import { EventoEstandes } from './evento-estandes.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Exclude } from 'class-transformer';
import { Gamificacao } from '../gamificacao/gamificacao.entity';
import { ParticipanteAcoes } from '../gamificacao/participante-acoes.entity';
import { Atividade } from '../atividade/atividade.entity';
import { GaleriaImagem } from '../galeria/galeria-imagem.entity';
import { EventoConfiguracoes } from './evento-configuracoes.entity';
import { EventoCacheVersion } from './evento-cache-version.entity';
import { EventoCodigo } from './evento-codigo.entity';
import { InscricaoModalidade } from '../inscricao/inscricao-modalidade.entity';
import { InscricaoExtra } from '../inscricao/inscricao-extra.entity';
import { Inscricao } from '../inscricao/inscricao.entity';
import { CertificadoModelo } from '../certificado/certificado-modelo.entity';

@Entity('evento')
export class Evento extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  site: string;

  @Column({ nullable: true })
  sigla: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ default: false })
  precisaInscricao: boolean;

  @Column({ default: false })
  galeriaRequerCuradoria: boolean;

  @Column()
  nota: number;

  @Column('date')
  dataInicio: string;

  @Column('date')
  dataFim: string;

  @Column()
  @Exclude()
  clienteId: string;

  @Column()
  enderecoId: string;

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

  @OneToMany(() => EventoImagens, (imagem) => imagem.evento, {
    eager: true,
  })
  imagens: EventoImagens[];

  @OneToMany('evento_avisos', 'evento')
  avisos: EventoAvisos[];

  @OneToMany('evento_participantes', 'evento')
  participantes: EventoParticipante[];

  @OneToMany('evento_comentarios', 'evento')
  comentarios: EventoComentarios[];

  @OneToMany('evento_avaliacoes', 'evento')
  avaliacoes: EventoAvaliacoes[];

  @OneToMany('evento_patrocinadores', 'evento')
  patrocinadores: EventoPatrocinadores[];

  @OneToMany('evento_estandes', 'evento')
  estandes: EventoEstandes[];

  @OneToMany(() => Gamificacao, (gamificacao) => gamificacao.evento, {
    eager: true,
  })
  gamificacoes: Gamificacao[];

  @OneToMany('participante_acoes', 'evento')
  participanteAcoes: ParticipanteAcoes[];

  @OneToMany('atividade', 'evento')
  atividades: Atividade[];

  @JoinColumn({ name: 'enderecoId' })
  @ManyToOne('endereco_evento', 'evento')
  endereco: EnderecoEvento;

  @JoinColumn({ name: 'clienteId' })
  @ManyToOne('cliente', 'evento')
  cliente: Cliente;

  @OneToOne('evento_configuracoes', 'evento')
  configuracoes: EventoConfiguracoes;

  @OneToOne('evento_cache_version', 'evento')
  cache: EventoCacheVersion;

  @OneToMany('galeria_imagem', 'evento')
  fotosGaleria: GaleriaImagem[];

  @OneToOne('evento_codigo', 'evento')
  codigo: EventoCodigo;

  @OneToMany(() => InscricaoModalidade, (modalidade) => modalidade.evento)
  modalidadesInscricao: InscricaoModalidade[];

  @OneToMany(() => InscricaoExtra, (extra) => extra.evento)
  extras: InscricaoExtra[];

  @OneToMany(() => Inscricao, (inscricao) => inscricao.evento)
  inscricoes: Inscricao[];

  @OneToOne(() => CertificadoModelo, (modelo) => modelo.evento)
  certificadoModelo: CertificadoModelo;
}
