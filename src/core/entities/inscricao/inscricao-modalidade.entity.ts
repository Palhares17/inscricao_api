/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from '../evento/evento.entity';
import { Inscricao } from './inscricao.entity';
import { MetodoPagamentoEnum } from '../../enum/metodo-pagamento.enum';

@Entity('inscricao_modalidade')
@Index('idx_modalidade_evento_id', ['eventoId'])
export class InscricaoModalidade extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventoId: string;

  @Column({ length: 255 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column()
  gratuito: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  preco: number | null;

  @Column()
  vagas: number;

  @Column({ default: 0 })
  vagasUtilizadas: number;

  @Column('timestamp')
  dataInicioVenda: Date;

  @Column('timestamp')
  dataFimVenda: Date;

  @Column({ type: 'text', nullable: true })
  documentosExigidos: string | null;

  @Column({
    type: 'enum',
    enum: MetodoPagamentoEnum,
    array: true,
    nullable: true,
  })
  metodosPagamento: MetodoPagamentoEnum[] | null;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne(() => Evento, (evento) => evento.modalidadesInscricao)
  evento: Evento;

  @OneToMany(() => Inscricao, (inscricao) => inscricao.modalidade)
  inscricoes: Inscricao[];
}
