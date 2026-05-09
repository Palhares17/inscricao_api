import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { OrderEnum, PaginationDto } from 'src/core/utils/pagination.dto';
import { IPaginatedResult } from 'src/core/utils/pagination.interface';
import { StatusInscricaoEnum } from 'src/core/enum/status-inscricao.enum';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Inscricao)
    private readonly inscricaoRepo: Repository<Inscricao>,
    @InjectRepository(Evento)
    private readonly eventRepository: Repository<Evento>,
  ) {}

  async findEnrollments(
    paginationDto: PaginationDto,
    eventoId: string,
  ): Promise<IPaginatedResult<Inscricao>> {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const { page = 1, limit = 10, order = OrderEnum.DESC } = paginationDto;

    const [items, total] = await this.inscricaoRepo.findAndCount({
      where: { eventoId },
      relations: { participante: { dados: true }, modalidade: true },
      order: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pagination: IPaginatedResult<Inscricao> = {
      data: items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    };

    return pagination;
  }

  async getCounters(eventoId: string) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const [
      total,
      confirmados,
      pendentes,
      cancelados,
      credenciados,
      certificadosEmitidos,
    ] = await Promise.all([
      this.inscricaoRepo.count({ where: { eventoId } }),
      this.inscricaoRepo.count({
        where: {
          eventoId,
          statusDoParticipante: StatusInscricaoEnum.Confirmado,
        },
      }),
      this.inscricaoRepo.count({
        where: {
          eventoId,
          statusDoParticipante: StatusInscricaoEnum.Pendente,
        },
      }),
      this.inscricaoRepo.count({
        where: {
          eventoId,
          statusDoParticipante: StatusInscricaoEnum.Cancelado,
        },
      }),
      this.inscricaoRepo.count({
        where: { eventoId, credenciamentoRealizado: true },
      }),
      this.inscricaoRepo
        .createQueryBuilder('i')
        .innerJoin('i.certificado', 'c')
        .where('i.eventoId = :eventoId', { eventoId })
        .andWhere('c.emitidoEm IS NOT NULL')
        .getCount(),
    ]);

    return {
      data: {
        total,
        confirmados,
        pendentes,
        cancelados,
        credenciados,
        certificadosEmitidos,
      },
    };
  }

  async cancelEnrollment(eventoId: string, inscricaoId: string) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const inscricao = await this.inscricaoRepo.findOne({
      where: { id: inscricaoId, eventoId },
    });
    if (!inscricao) {
      throw new NotFoundException('Inscrição não encontrada para este evento.');
    }

    if (inscricao.statusDoParticipante === StatusInscricaoEnum.Cancelado) {
      throw new BadRequestException('Inscrição já está cancelada.');
    }

    inscricao.statusDoParticipante = StatusInscricaoEnum.Cancelado;
    const saved = await this.inscricaoRepo.save(inscricao);

    return {
      data: {
        id: saved.id,
        eventoId: saved.eventoId,
        participanteId: saved.participanteId,
        modalidadeId: saved.modalidadeId,
        statusDoParticipante: saved.statusDoParticipante,
        credenciamentoRealizado: saved.credenciamentoRealizado,
        updatedAt: saved.updatedAt,
      },
    };
  }
}
