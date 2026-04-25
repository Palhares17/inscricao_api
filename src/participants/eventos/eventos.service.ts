import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from '../../core/entities/evento/evento.entity';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventosRepository: Repository<Evento>,
  ) {}

  findAll(): Promise<Evento[]> {
    return this.eventosRepository.find({ where: { ativo: true } });
  }
}
