import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NumeroSorteio } from './numero-sorteio.entity';
import { Exclude } from 'class-transformer';

@Entity('numero_sorteado')
export class NumeroSorteado extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numeroSorteioId: string;

  @Column()
  resgatado: boolean;

  @JoinColumn({ name: 'numeroSorteioId' })
  @ManyToOne('numero_sorteio', 'numero_sorteado')
  numeroSorteio: NumeroSorteio;

  @Column()
  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;
}
