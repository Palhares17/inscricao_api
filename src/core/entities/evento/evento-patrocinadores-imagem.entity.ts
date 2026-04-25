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
import { EventoPatrocinadores } from './evento-patrocinadores.entity';
import { Exclude } from 'class-transformer';

@Entity('evento_patrocinadores_imagem')
export class EventoPatrocinadoresImagem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
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

  @Column({ nullable: true })
  @Exclude()
  patrocinadorId: string;

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

  // @JoinColumn({ name: 'patrocinadorId' })
  @OneToOne('evento_patrocinadores', 'evento_patrocinadores_imagem', {
    nullable: true,
  })
  @JoinColumn({ name: 'patrocinadorId' })
  patrocinador: EventoPatrocinadores;
}
