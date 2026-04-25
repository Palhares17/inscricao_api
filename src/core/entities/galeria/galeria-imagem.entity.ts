import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Evento } from '../evento/evento.entity';
import { GaleriaImagemStatus } from './galeria-imagem-status.entity';
import { Exclude } from 'class-transformer';

@Entity('galeria_imagem')
export class GaleriaImagem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  @Exclude()
  s3Key: string;

  @Column({ nullable: true })
  @Exclude()
  fileName: string;

  @Column({ nullable: true })
  @Exclude()
  fileSize: number;

  @Column({ nullable: true })
  @Exclude()
  mimeType: string;

  @Column('int')
  tamanhoOriginal: number;

  @Column('int')
  tamanhoConvertido: number;

  @Column({ default: true })
  aprovada: boolean;

  @Column()
  statusId: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  denuncias: number;

  @Column({ default: false })
  compartilhavel: boolean;

  @Column()
  eventoId: string;

  @Column()
  participanteId: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  updatedBy: string;

  @ManyToOne('evento', 'galeria_imagem')
  evento: Evento;

  @ManyToOne(() => GaleriaImagemStatus, (status) => status.imagem)
  @JoinColumn({ name: 'statusId' })
  statusAtual: GaleriaImagemStatus;
}
