import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EnderecoEventoLugares } from '../endereco/endereco-evento-lugares.entity';
import { QrCodeConfirmacaoPresenca } from './qrcode_confirmacao_presenca';

@Entity('qrcode_sala')
export class QrCodeSala {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  salaId: string;

  @ManyToOne(
    () => EnderecoEventoLugares,
    (enderecoEventoLugares) => enderecoEventoLugares.qrCodeSala,
  )
  @JoinColumn({ name: 'salaId' })
  sala: EnderecoEventoLugares;

  @OneToMany(
    () => QrCodeConfirmacaoPresenca,
    (qrCodeConfirmacao) => qrCodeConfirmacao.qrCode,
  )
  confirmacoesPresenca: QrCodeConfirmacaoPresenca[];
}
