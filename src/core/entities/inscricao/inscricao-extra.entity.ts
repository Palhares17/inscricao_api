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
import { Evento } from '../evento/evento.entity';
import { InscricaoExtraParticipante } from './inscricao-extra-participante.entity';

@Entity('inscricao_extra')
export class InscricaoExtra extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventoId: string;

  @Column({ length: 255 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column()
  gratuito: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  preco: number | null;

  @Column()
  vagas: number;

  @Column()
  vaiTerCertificado: boolean;

  @Column({ type: 'timestamp', nullable: true })
  cargaHoraria: Date | null;

  @Column({ default: 0 })
  vagasUtilizadas: number;

  @Column('timestamp')
  dataInicioDoExtra: Date;

  @Column('timestamp')
  dataFimDoExtra: Date;

  @Column('timestamp')
  dataInicioVenda: Date;

  @Column('timestamp')
  dataFimVenda: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne(() => Evento, (evento) => evento.extras)
  evento: Evento;

  @OneToMany(
    () => InscricaoExtraParticipante,
    (participacao) => participacao.extra,
  )
  participacoes: InscricaoExtraParticipante[];
}
