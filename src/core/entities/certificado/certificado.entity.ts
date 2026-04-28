import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Inscricao } from '../inscricao/inscricao.entity';
import { CertificadoModelo } from './certificado-modelo.entity';

@Entity('certificado')
@Unique('uq_certificado_inscricao_id', ['inscricaoId'])
@Unique('uq_certificado_codigo', ['codigoValidacao'])
export class Certificado extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inscricaoId: string;

  @Column()
  modeloId: string;

  @Column({ length: 64 })
  codigoValidacao: string;

  @Column({ type: 'timestamp', nullable: true })
  emitidoEm: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn({ name: 'inscricaoId' })
  @OneToOne(() => Inscricao, (inscricao) => inscricao.certificado)
  inscricao: Inscricao;

  @JoinColumn({ name: 'modeloId' })
  @ManyToOne(() => CertificadoModelo, (modelo) => modelo.certificados)
  modelo: CertificadoModelo;
}
