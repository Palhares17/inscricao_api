import { Exclude } from 'class-transformer';
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
import { Gamificacao } from './gamificacao.entity';
import { MissaoCategoria } from './missao-categoria.entity';
import { MissaoParticipante } from './missao-participante.entity';

@Entity('missao')
export class Missao extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  n: number;

  @Column({ type: 'timestamp', nullable: true })
  dia: string;

  @Column()
  repetivel: boolean;

  @Column()
  reciclavel: boolean;

  @Column({ nullable: true })
  entidadeId: string;

  @Column()
  gamificacaoId: string;

  @Column()
  missaoCategoriaId: string;

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

  @OneToMany(
    () => MissaoParticipante,
    (missaoParticipante) => missaoParticipante.missao,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  missoesParticipante: MissaoParticipante[];

  @ManyToOne(() => Gamificacao, (gamificacao) => gamificacao.missoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gamificacaoId' })
  gamificacao: Gamificacao;

  @JoinColumn({ name: 'missaoCategoriaId' })
  @ManyToOne('missao_categoria', 'missao')
  missaoCategoria: MissaoCategoria;
}
