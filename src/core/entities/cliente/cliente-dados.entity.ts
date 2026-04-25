import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';
import { Exclude } from 'class-transformer';

@Entity('cliente_dados')
@Unique(['email'])
export class ClienteDados extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  telefone: string;

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

  @JoinColumn({ name: 'clienteId' })
  @OneToOne('cliente', 'cliente_dados')
  cliente: Cliente;
}
