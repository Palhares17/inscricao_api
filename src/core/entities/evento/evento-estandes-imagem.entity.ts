import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventoEstandes } from './evento-estandes.entity';
import { Exclude } from 'class-transformer';

@Entity('evento_estandes_imagem')
export class EventoEstandesImagem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
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

  @Column({ nullable: true })
  @Exclude()
  estandeId: string;

  @Column()
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @Exclude()
  createdBy: string;

  @Column()
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Exclude()
  updatedBy: string;

  @OneToOne('evento_estandes', 'evento_estandes_imagem', {
    nullable: true,
  })
  @JoinColumn({ name: 'estandeId' })
  estande: EventoEstandes;
}
