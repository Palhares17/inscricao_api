import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { EventsService } from './eventos.service';
import { Evento } from '../../core/entities/evento/evento.entity';

@Controller('eventos')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventsService.findAll();
  }

  @Get(':eventoId')
  findOne(@Param('eventoId', ParseUUIDPipe) eventoId: string): Promise<Evento> {
    return this.eventsService.findOne(eventoId);
  }
}
