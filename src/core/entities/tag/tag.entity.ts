import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from '../evento/evento.entity';
import { Exclude } from 'class-transformer';

@Entity('tag')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column()
  descricao: string;

  @Column({ nullable: true })
  cor: string;

  @Column()
  eventoId: string;

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

  @Column()
  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt: Date;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'tag')
  evento: Evento;
}
