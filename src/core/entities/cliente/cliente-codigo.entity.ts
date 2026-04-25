import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Exclude } from 'class-transformer';

@Entity('cliente_codigo')
@Unique(['codigo'])
export class ClienteCodigo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ unique: true })
  @Exclude()
  codigo: string;

  @Column({ default: true })
  valido: boolean;

  @Column({ nullable: true })
  @Exclude()
  clienteId: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @JoinColumn({ name: 'clienteId' })
  @OneToOne('cliente', 'cliente_codigo')
  cliente: Cliente;
}
