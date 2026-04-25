import { Evento } from '../evento/evento.entity';
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
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { AtividadeCategorias } from './atividade-categorias.entity';
import { AtividadeParticipante } from './atividade-participante.entity';
import { AtividadeImagens } from './atividade-imagens.entity';
import { AtividadeComentarios } from './atividade-comentarios.entity';
import { EnderecoEventoLugares } from '../endereco/endereco-evento-lugares.entity';
import { Exclude } from 'class-transformer';
import { Tag } from '../tag/tag.entity';
import { AtividadeReacoes } from './atividade-reacoes.entity';
import { QrCodeConfirmacaoPresenca } from '../qrcode/qrcode_confirmacao_presenca';
import { AtividadeConfiguracoes } from './atividade-configuracoes';

@Entity('atividade')
export class Atividade extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column({ default: true })
  ativo: boolean;

  @Column('timestamp')
  dataInicio: Date;

  @Column('timestamp')
  dataFim: Date;

  @Column()
  lugarId: string;

  @Column()
  eventoId: string;

  @Column({ nullable: true })
  categoriaId: string;

  @Column()
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

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'atividade')
  evento: Evento;

  @JoinColumn({ name: 'lugarId' })
  @ManyToOne('endereco_evento_lugares', 'atividade')
  lugar: EnderecoEventoLugares;

  @JoinColumn({ name: 'categoriaId' })
  @ManyToOne('atividade_categorias', 'atividade')
  categoria: AtividadeCategorias;

  @OneToMany('atividade_reacoes', 'atividade')
  avaliacoes: AtividadeReacoes[];

  @OneToMany('atividade_imagens', 'atividade')
  imagens: AtividadeImagens[];

  @OneToMany('atividade_comentarios', 'atividade')
  comentarios: AtividadeComentarios[];

  @OneToMany('atividade_participante', 'atividade')
  atividadeParticipante: AtividadeParticipante[];

  @OneToMany('qrcode_confirmacao_presenca', 'atividade')
  qrCodeConfirmacoes: QrCodeConfirmacaoPresenca[];

  @OneToOne('atividade_configuracoes', 'atividade')
  configuracoes: AtividadeConfiguracoes;
}
