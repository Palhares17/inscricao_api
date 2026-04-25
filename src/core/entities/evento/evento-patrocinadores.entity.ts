import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Exclude } from 'class-transformer';
import { EventoPatrocinadoresImagem } from './evento-patrocinadores-imagem.entity';

@Entity('evento_patrocinadores')
export class EventoPatrocinadores extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ nullable: true })
  url: string;

  @Column()
  prioridade: number;

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
  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @JoinColumn({ name: 'eventoId' })
  @ManyToOne('evento', 'evento_patrocinadores')
  evento: Evento;

  @OneToOne(() => EventoPatrocinadoresImagem, (imagem) => imagem.patrocinador, {
    nullable: true,
    eager: false, // ou true, se quiser carregar automaticamente
  })
  imagem: EventoPatrocinadoresImagem;
}
