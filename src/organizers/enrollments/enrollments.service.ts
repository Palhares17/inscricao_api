import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { InscricaoModalidade } from 'src/core/entities/inscricao/inscricao-modalidade.entity';
import { InscricaoExtra } from 'src/core/entities/inscricao/inscricao-extra.entity';
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
    @InjectRepository(InscricaoModalidade)
    private readonly modalidadeRepo: Repository<InscricaoModalidade>,
    @InjectRepository(InscricaoExtra)
    private readonly extraRepo: Repository<InscricaoExtra>,
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

  async getStatistics(eventoId: string) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const [
      modalidadeRows,
      extraRows,
      perDayRows,
      perHourRows,
      totalCredenciados,
    ] = await Promise.all([
      this.modalidadeRepo
        .createQueryBuilder('m')
        .leftJoin('inscricao', 'i', 'i."modalidadeId" = m.id')
        .where('m."eventoId" = :eventoId', { eventoId })
        .select('m.id', 'modalidadeId')
        .addSelect('m.nome', 'nome')
        .addSelect('COUNT(i.id)', 'totalInscritos')
        .addSelect(
          `COUNT(CASE WHEN i."statusDoParticipante" = :confirmado THEN 1 END)`,
          'confirmados',
        )
        .addSelect(
          `COUNT(CASE WHEN i."credenciamentoRealizado" = true THEN 1 END)`,
          'credenciados',
        )
        .setParameter('confirmado', StatusInscricaoEnum.Confirmado)
        .groupBy('m.id')
        .addGroupBy('m.nome')
        .orderBy('m.nome', 'ASC')
        .getRawMany(),

      this.extraRepo
        .createQueryBuilder('e')
        .leftJoin(
          'inscricao_extra_participante',
          'iep',
          'iep."extraId" = e.id',
        )
        .where('e."eventoId" = :eventoId', { eventoId })
        .select('e.id', 'extraId')
        .addSelect('e.nome', 'nome')
        .addSelect('COUNT(iep.id)', 'totalParticipantes')
        .addSelect(
          `COUNT(CASE WHEN iep."credenciamentoRealizado" = true THEN 1 END)`,
          'credenciados',
        )
        .groupBy('e.id')
        .addGroupBy('e.nome')
        .orderBy('e.nome', 'ASC')
        .getRawMany(),

      this.inscricaoRepo
        .createQueryBuilder('i')
        .where('i."eventoId" = :eventoId', { eventoId })
        .andWhere('i."credenciamentoRealizado" = true')
        .andWhere('i."credenciamentoEm" IS NOT NULL')
        .select(`DATE_TRUNC('day', i."credenciamentoEm")`, 'periodo')
        .addSelect('COUNT(*)', 'total')
        .groupBy('periodo')
        .orderBy('periodo', 'ASC')
        .getRawMany(),

      this.inscricaoRepo
        .createQueryBuilder('i')
        .where('i."eventoId" = :eventoId', { eventoId })
        .andWhere('i."credenciamentoRealizado" = true')
        .andWhere('i."credenciamentoEm" IS NOT NULL')
        .select(`DATE_TRUNC('hour', i."credenciamentoEm")`, 'periodo')
        .addSelect('COUNT(*)', 'total')
        .groupBy('periodo')
        .orderBy('periodo', 'ASC')
        .getRawMany(),

      this.inscricaoRepo.count({
        where: { eventoId, credenciamentoRealizado: true },
      }),
    ]);

    const toRate = (numerator: number, denominator: number) =>
      denominator > 0 ? Number((numerator / denominator).toFixed(4)) : 0;

    const porModalidade = modalidadeRows.map((row) => {
      const totalInscritos = Number(row.totalInscritos);
      const confirmados = Number(row.confirmados);
      const credenciados = Number(row.credenciados);
      return {
        modalidadeId: row.modalidadeId,
        nome: row.nome,
        totalInscritos,
        confirmados,
        credenciados,
        taxaCredenciamento: toRate(credenciados, confirmados),
      };
    });

    const porExtra = extraRows.map((row) => {
      const totalParticipantes = Number(row.totalParticipantes);
      const credenciados = Number(row.credenciados);
      return {
        extraId: row.extraId,
        nome: row.nome,
        totalParticipantes,
        credenciados,
        taxaCredenciamento: toRate(credenciados, totalParticipantes),
      };
    });

    const credenciamentoPorDia = perDayRows.map((row) => ({
      periodo: row.periodo,
      total: Number(row.total),
    }));

    const credenciamentoPorHora = perHourRows.map((row) => ({
      periodo: row.periodo,
      total: Number(row.total),
    }));

    return {
      data: {
        totalCredenciados,
        porModalidade,
        porExtra,
        credenciamentoPorDia,
        credenciamentoPorHora,
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

  async cancelParticipantEnrollment(eventoId: string, participanteId: string) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const inscricao = await this.inscricaoRepo.findOne({
      where: { eventoId, participanteId },
    });
    if (!inscricao) {
      throw new NotFoundException(
        'Participante não possui inscrição neste evento.',
      );
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
