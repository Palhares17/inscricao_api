import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ClienteOrganizadores } from './cliente-organizadores.entity';

@Entity('cliente_organizadores_roles')
@Unique(['nome'])
export class ClienteOrganizadoresRoles extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ unique: true })
  nome: string;

  @OneToMany('cliente_organizadores', 'cliente_organizadores_roles')
  organizadores: ClienteOrganizadores[];
}
