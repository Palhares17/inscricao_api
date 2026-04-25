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
import { Participante } from '../participante/participante.entity';
import { NumeroSorteado } from './numero-sorteado.entity';
import { Exclude } from 'class-transformer';

@Entity('numero_sorteio')
export class NumeroSorteio extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numero: string;

  @Column()
  participanteId: string;

  @Column()
  gamificacaoId: string;

  @JoinColumn({ name: 'participanteId' })
  @ManyToOne('participante', 'numero_sorteio')
  participante: Participante;

  @JoinColumn({ name: 'gamificacaoId' })
  @ManyToOne('gamificacao', 'numero_sorteio')
  gamificacao: Gamificacao;

  @OneToMany(
    () => NumeroSorteado,
    (numeroSorteado) => numeroSorteado.numeroSorteio,
  )
  numeroSorteado: NumeroSorteado[];

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
