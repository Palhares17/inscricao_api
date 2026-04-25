import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Participante } from './participante.entity';
import { Exclude } from 'class-transformer';
import { ParticipanteEscolaridadeCategorias } from './participante-escolaridade-categorias.entity';
import { ParticipanteAreasProfissionaisCategorias } from './participante-areas-profissionais-categorias.entity';

@Entity('participante_dados')
@Unique(['email'])
export class ParticipanteDados extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  setorId: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  lattes: string;

  @Column({ nullable: true })
  linkCurriculo: string;

  @Column({ nullable: true })
  estado: string;

  @Column({ nullable: true })
  cidade: string;

  @Column({ nullable: true })
  escolaridadeId: string;

  @Column({ nullable: true })
  pais: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  senha: string;

  @Column()
  @Exclude()
  participanteId: string;

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

  @JoinColumn({ name: 'participanteId' })
  @OneToOne('participante', 'participante_dados')
  participante: Participante;

  @JoinColumn({ name: 'escolaridadeId' })
  @ManyToOne('participante_escolaridade_categorias', 'participante_dados')
  escolaridade: ParticipanteEscolaridadeCategorias;

  @JoinColumn({ name: 'setorId' })
  @ManyToOne(
    'participante_areas_profissionais_categorias',
    'participante_dados',
  )
  setor: ParticipanteAreasProfissionaisCategorias;
}
