import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Missao } from './missao.entity';
import { Evento } from '../evento/evento.entity';
import { NumeroSorteio } from './numero-sorteio.entity';
import { Tag } from '../tag/tag.entity';

@Entity('gamificacao')
export class Gamificacao extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ativo: boolean;

  @Column()
  numeroMissoes: number;

  @Column()
  premio: string;

  @Column()
  eventoId: string;

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

  @OneToMany(() => Missao, (missao) => missao.gamificacao, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  missoes: Missao[];

  @OneToMany('numero_sorteio', 'gamificacao')
  numerosSorteio: NumeroSorteio[];

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'gamificacao')
  evento: Evento;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
