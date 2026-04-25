import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Evento } from './evento.entity';
import { Exclude } from 'class-transformer';
import { EventoEstandesImagem } from './evento-estandes-imagem.entity';
import { EventoEstandesDatas } from './evento-estandes-datas.entity';
import { QrCodeEstandePresenca } from '../qrcode/qrcode_estande_presenca.entity';
import { EnderecoEventoLugares } from '../endereco/endereco-evento-lugares.entity';

@Entity('evento_estandes')
export class EventoEstandes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column()
  eventoId: string;

  @Column()
  lugarId: string;

  @Column()
  site: string;

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
  @ManyToOne('evento', 'evento_estandes')
  evento: Evento;

  @JoinColumn({ name: 'lugarId' })
  @ManyToOne(() => EnderecoEventoLugares, (lugar) => lugar.estandes)
  lugar: EnderecoEventoLugares;

  @OneToOne(() => EventoEstandesImagem, (imagem) => imagem.estande, {
    nullable: true,
    eager: false,
    cascade: true,
  })
  imagem: EventoEstandesImagem;

  @OneToMany(() => EventoEstandesDatas, (data) => data.estande, {
    cascade: true,
    eager: false,
  })
  datas: EventoEstandesDatas[];

  @OneToMany(() => QrCodeEstandePresenca, (presenca) => presenca.estande)
  presencas: QrCodeEstandePresenca[];
}
