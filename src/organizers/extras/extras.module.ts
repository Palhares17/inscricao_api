import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtrasService } from './extras.service';
import { ExtrasController } from './extras.controller';
import { InscricaoExtra } from 'src/core/entities/inscricao/inscricao-extra.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([InscricaoExtra, Evento]), AuthModule],
  controllers: [ExtrasController],
  providers: [ExtrasService],
})
export class ExtrasModule {}
