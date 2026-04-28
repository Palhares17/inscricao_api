import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from '../evento/evento.entity';
import { Certificado } from './certificado.entity';

@Entity('certificado_modelo')
@Unique('uq_modelo_evento_id', ['eventoId'])
export class CertificadoModelo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  eventoId: string;

  @Column({ type: 'text', nullable: true })
  textoPersonalizado: string;

  @Column({ nullable: true })
  cargaHorariaFixa: number;

  @Column({ default: true })
  ativo: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: 'eventoId' })
  @OneToOne(() => Evento, (evento) => evento.certificadoModelo)
  evento: Evento;

  @OneToMany(() => Certificado, (certificado) => certificado.modelo)
  certificados: Certificado[];
}
