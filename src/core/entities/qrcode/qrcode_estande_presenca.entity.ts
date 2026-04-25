import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Participante } from '../participante/participante.entity';
import { EventoEstandes } from '../evento/evento-estandes.entity';

@Entity('qrcode_estande_presenca')
export class QrCodeEstandePresenca {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  estandeId: string;

  @Column()
  participanteId: string;

  @Column({ nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => EventoEstandes, (estande) => estande.presencas)
  @JoinColumn({ name: 'estandeId' })
  estande: EventoEstandes;

  @ManyToOne(
    () => Participante,
    (participante) => participante.qrCodeConfirmacoes,
  )
  @JoinColumn({ name: 'participanteId' })
  participante: Participante;
}
