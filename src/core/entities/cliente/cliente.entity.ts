import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClienteDados } from './cliente-dados.entity';
import { ClienteOrganizadores } from './cliente-organizadores.entity';
import { ClienteCodigo } from './cliente-codigo.entity';
import { EnderecoEvento } from 'src/core/entities/endereco/endereco-evento.entity';
import { Exclude } from 'class-transformer';

@Entity('cliente')
export class Cliente extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ default: true })
  ativo: boolean;

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

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany('cliente_organizadores', 'cliente')
  organizadores: ClienteOrganizadores[];

  @OneToMany('endereco_evento', 'cliente')
  enderecos: EnderecoEvento[];

  @OneToOne('cliente_dados', 'cliente')
  dados: ClienteDados;

  @OneToOne('cliente_codigo', 'cliente')
  codigo: ClienteCodigo;
}
