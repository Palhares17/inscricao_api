import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from '../../core/entities/evento/evento.entity';
import { EventsController } from './eventos.controller';
import { EventsService } from './eventos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Evento])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventosModule {}
