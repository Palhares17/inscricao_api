import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Participante } from '../participante/participante.entity';
import { Atividade } from '../atividade/atividade.entity';
import { QrCodeSala } from './qrcode_sala.entity';

@Entity('qrcode_confirmacao_presenca')
export class QrCodeConfirmacaoPresenca {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  qrCodeId: string;

  @Column()
  atividadeId: string;

  @Column()
  participanteId: string;

  @ManyToOne(() => QrCodeSala, (qrCodeSala) => qrCodeSala.confirmacoesPresenca)
  @JoinColumn({ name: 'qrCodeId' })
  qrCode: QrCodeSala;

  @ManyToOne(
    () => Participante,
    (participante) => participante.qrCodeConfirmacoes,
  )
  @JoinColumn({ name: 'participanteId' })
  usuariosConfirmado: Participante;

  @ManyToOne(() => Atividade, (atividade) => atividade.qrCodeConfirmacoes)
  @JoinColumn({ name: 'atividadeId' })
  atividade: Atividade;

  @Column({ nullable: true })
  @CreateDateColumn()
  createdAt: Date;
}
