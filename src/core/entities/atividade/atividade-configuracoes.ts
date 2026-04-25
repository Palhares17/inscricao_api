import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Atividade } from './atividade.entity';
import { Exclude } from 'class-transformer';

@Entity('atividade_configuracoes')
export class AtividadeConfiguracoes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ default: false })
  checkin: boolean;

  @Column({ default: false })
  perguntar: boolean;

  @Column()
  @Exclude()
  atividadeId: string;

  @JoinColumn({ name: 'atividadeId' })
  @OneToOne('atividade', 'atividade_configuracoes')
  atividade: Atividade;
}
