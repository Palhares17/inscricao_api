import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EnderecoEvento } from './endereco-evento.entity';
import { Atividade } from 'src/core/entities/atividade/atividade.entity';
import { Exclude } from 'class-transformer';
import { QrCodeSala } from '../qrcode/qrcode_sala.entity'; // Importe QrCode
import { EventoEstandes } from '../evento/evento-estandes.entity';

@Entity('endereco_evento_lugares')
export class EnderecoEventoLugares extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  detalhes: string;

  @Column()
  enderecoId: string;

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

  @JoinColumn({ name: 'enderecoId' })
  @ManyToOne('endereco_evento', 'endereco_evento_lugares')
  enderecoEvento: EnderecoEvento;

  @OneToMany('atividade', 'endereco_evento_lugares')
  atividades: Atividade[];

  @OneToOne(() => QrCodeSala, (qrCodeSala) => qrCodeSala.sala)
  qrCodeSala: QrCodeSala;

  @OneToMany(() => EventoEstandes, (estande) => estande.lugar)
  estandes: EventoEstandes[];
}
