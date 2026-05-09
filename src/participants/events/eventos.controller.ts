import { Controller, Get } from '@nestjs/common';
import { EventsService } from './eventos.service';
import { Evento } from '../../core/entities/evento/evento.entity';

@Controller('eventos')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Promise<Evento[]> {
    return this.eventsService.findAll();
  }
}
