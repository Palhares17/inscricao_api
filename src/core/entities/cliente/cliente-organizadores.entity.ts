import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Exclude } from 'class-transformer';
import { DuvidaResposta } from '../duvida/duvida_resposta.entity';
import { ClienteOrganizadoresRoles } from './cliente-organizadores-roles.entity';

@Entity('cliente_organizadores')
export class ClienteOrganizadores extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  senha: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ nullable: true })
  roleId: string;

  @Column()
  @Exclude()
  clienteId: string;

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

  @JoinColumn({ name: 'clienteId' })
  @ManyToOne('cliente', 'cliente_organizadores')
  cliente: Cliente;

  @JoinColumn({ name: 'roleId' })
  @ManyToOne('cliente_organizadores_roles', 'cliente_organizadores')
  role: ClienteOrganizadoresRoles;

  @OneToMany('duvida_resposta', 'cliente_organizadores')
  respostas: DuvidaResposta[];
}
