import { Evento } from '../evento/evento.entity';
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
import { EnderecoEventoLugares } from './endereco-evento-lugares.entity';
import { Cliente } from '../cliente/cliente.entity';
import { Exclude } from 'class-transformer';

@Entity('endereco_evento')
export class EnderecoEvento extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  logradouro: string;

  @Column()
  numero: string;

  @Column()
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  pais: string;

  @Column()
  cep: string;

  @Column()
  complemento: string;

  @Column()
  enderecoCompleto: string;

  @Column('double precision', { nullable: true })
  lat: number;

  @Column('double precision', { nullable: true })
  lng: number;

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

  @Column()
  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn({ name: 'clienteId' })
  @ManyToOne('cliente', 'endereco_evento')
  cliente: Cliente;

  @OneToMany('evento', 'endereco_evento')
  eventos: Evento[];

  @OneToMany('evento', 'endereco_evento_lugares')
  eventoLugares: EnderecoEventoLugares[];
}
