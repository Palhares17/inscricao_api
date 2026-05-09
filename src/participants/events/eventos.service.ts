import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from '../../core/entities/evento/evento.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventosRepository: Repository<Evento>,
  ) {}

  findAll(): Promise<Evento[]> {
    return this.eventosRepository.find({ where: { ativo: true } });
  }

  async findOne(eventoId: string): Promise<Evento> {
    const evento = await this.eventosRepository.findOne({ where: { id: eventoId, ativo: true } });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    return evento;
  }
}
