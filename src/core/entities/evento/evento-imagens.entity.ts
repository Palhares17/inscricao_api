import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Exclude } from 'class-transformer';

@Entity('evento_imagens')
export class EventoImagens extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  @Exclude()
  s3Key: string;

  @Column({ type: 'bytea', nullable: true })
  @Exclude()
  content: Buffer;

  @Column({ nullable: true })
  @Exclude()
  fileName: string;

  @Column({ nullable: true })
  @Exclude()
  fileSize: number;

  @Column({ nullable: true })
  @Exclude()
  mimeType: string;

  @Column()
  @Exclude()
  eventoId: string;

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

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'evento_imagens')
  evento: Evento;
}
