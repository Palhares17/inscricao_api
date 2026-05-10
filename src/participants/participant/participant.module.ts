import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { Participante } from 'src/core/entities/participante/participante.entity';
import { ParticipanteDados } from 'src/core/entities/participante/participante-dados.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participante, ParticipanteDados])],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
