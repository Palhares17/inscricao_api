import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtrasService } from './extras.service';
import { ExtrasController } from './extras.controller';
import { InscricaoExtra } from 'src/core/entities/inscricao/inscricao-extra.entity';
import { InscricaoExtraParticipante } from 'src/core/entities/inscricao/inscricao-extra-participante.entity';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InscricaoExtra,
      InscricaoExtraParticipante,
      Inscricao,
      Evento,
    ]),
    AuthModule,
  ],
  controllers: [ExtrasController],
  providers: [ExtrasService],
})
export class ExtrasModule {}
