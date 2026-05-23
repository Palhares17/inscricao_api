import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { InscricaoExtra } from 'src/core/entities/inscricao/inscricao-extra.entity';
import { InscricaoExtraParticipante } from 'src/core/entities/inscricao/inscricao-extra-participante.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { StatusInscricaoEnum } from 'src/core/enum/status-inscricao.enum';
import { OrderEnum, PaginationDto } from 'src/core/utils/pagination.dto';
import { IPaginatedResult } from 'src/core/utils/pagination.interface';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(Inscricao)
    private readonly enrollmentRepo: Repository<Inscricao>,
    @InjectRepository(InscricaoExtra)
    private readonly extraRepo: Repository<InscricaoExtra>,
    @InjectRepository(InscricaoExtraParticipante)
    private readonly extraParticipanteRepo: Repository<InscricaoExtraParticipante>,
    @InjectRepository(Evento)
    private readonly eventRepo: Repository<Evento>,
  ) {}

  async validate(eventId: string, createCheckInDto: CreateCheckInDto) {
    const enrollment = await this.findEnrollmentForCheckIn(
      eventId,
      createCheckInDto.qrCodeToken,
    );

    return this.checkInResponse(enrollment);
  }

  async confirm(eventId: string, createCheckInDto: CreateCheckInDto) {
    const enrollment = await this.findEnrollmentForCheckIn(
      eventId,
      createCheckInDto.qrCodeToken,
    );

    if (enrollment.credenciamentoRealizado) {
      throw new BadRequestException('Credenciamento já realizado.');
    }

    enrollment.credenciamentoRealizado = true;
    enrollment.credenciamentoEm = new Date();
    const saved = await this.enrollmentRepo.save(enrollment);

    return {
      ...this.checkInResponse(enrollment),
      credenciado: saved.credenciamentoRealizado,
      credenciadoEm: saved.credenciamentoEm,
    };
  }

  async validateExtra(
    eventId: string,
    extraId: string,
    createCheckInDto: CreateCheckInDto,
  ) {
    const enrollment = await this.findEnrollmentForCheckIn(
      eventId,
      createCheckInDto.qrCodeToken,
      { withExtras: true },
    );

    const extra = enrollment.extras.find((item) => item.extraId === extraId);
    if (!extra) {
      throw new NotFoundException('Extra não encontrado para esta inscrição.');
    }

    if (!extra.extra.exigeCredenciamento) {
      throw new BadRequestException('Este extra não exige credenciamento.');
    }

    return {
      ...this.checkInResponse(enrollment),
      extra: {
        id: extra.extraId,
        nome: extra.extra.nome,
        descricao: extra.extra.descricao,
        credenciado: extra.credenciamentoRealizado,
        credenciadoEm: extra.credenciamentoEm,
      },
    };
  }

  async cancel(eventId: string, createCheckInDto: CreateCheckInDto) {
    const enrollment = await this.findEnrollmentForCheckIn(
      eventId,
      createCheckInDto.qrCodeToken,
    );

    if (!enrollment.credenciamentoRealizado) {
      throw new BadRequestException(
        'Credenciamento ainda não foi realizado para esta inscrição.',
      );
    }

    enrollment.credenciamentoRealizado = false;
    enrollment.credenciamentoEm = null;
    const saved = await this.enrollmentRepo.save(enrollment);

    return {
      ...this.checkInResponse(saved),
      credenciado: saved.credenciamentoRealizado,
      credenciadoEm: saved.credenciamentoEm,
    };
  }

  async cancelExtra(
    eventId: string,
    extraId: string,
    createCheckInDto: CreateCheckInDto,
  ) {
    const enrollment = await this.findEnrollmentForCheckIn(
      eventId,
      createCheckInDto.qrCodeToken,
      { withExtras: true },
    );

    const extra = enrollment.extras.find((item) => item.extraId === extraId);
    if (!extra) {
      throw new NotFoundException('Extra não encontrado para esta inscrição.');
    }

    if (!extra.extra.exigeCredenciamento) {
      throw new BadRequestException('Este extra não exige credenciamento.');
    }

    if (!extra.credenciamentoRealizado) {
      throw new BadRequestException(
        'Credenciamento do extra ainda não foi realizado.',
      );
    }

    extra.credenciamentoRealizado = false;
    extra.credenciamentoEm = null;
    const saved = await this.extraParticipanteRepo.save(extra);

    return {
      ...this.checkInResponse(enrollment),
      extra: {
        id: extra.extraId,
        nome: extra.extra.nome,
        descricao: extra.extra.descricao,
        credenciado: saved.credenciamentoRealizado,
        credenciadoEm: saved.credenciamentoEm,
      },
    };
  }

  async confirmExtra(
    eventId: string,
    extraId: string,
    createCheckInDto: CreateCheckInDto,
  ) {
    const enrollment = await this.findEnrollmentForCheckIn(
      eventId,
      createCheckInDto.qrCodeToken,
      { withExtras: true },
    );

    const extra = enrollment.extras.find((item) => item.extraId === extraId);
    if (!extra) {
      throw new NotFoundException('Extra não encontrado para esta inscrição.');
    }

    if (!extra.extra.exigeCredenciamento) {
      throw new BadRequestException('Este extra não exige credenciamento.');
    }

    if (extra.credenciamentoRealizado) {
      throw new BadRequestException('Credenciamento do extra já realizado.');
    }

    extra.credenciamentoRealizado = true;
    extra.credenciamentoEm = new Date();
    const saved = await this.extraParticipanteRepo.save(extra);

    return {
      ...this.checkInResponse(enrollment),
      extra: {
        id: extra.extraId,
        nome: extra.extra.nome,
        descricao: extra.extra.descricao,
        credenciado: saved.credenciamentoRealizado,
        credenciadoEm: saved.credenciamentoEm,
      },
    };
  }

  async listEventCrendentials(
    eventId: string,
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResult<unknown>> {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const { page = 1, limit = 10, order = OrderEnum.DESC } = paginationDto;

    const [items, total] = await this.enrollmentRepo.findAndCount({
      where: { eventoId: eventId, credenciamentoRealizado: true },
      relations: { participante: { dados: true }, modalidade: true },
      order: { credenciamentoEm: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = items.map((enrollment) => ({
      ...this.checkInResponse(enrollment),
      inscricaoId: enrollment.id,
      credenciadoEm: enrollment.credenciamentoEm,
    }));

    return {
      data,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async ListExtraCrendentials(
    eventId: string,
    extraId: string,
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResult<unknown>> {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const extraEntity = await this.extraRepo.findOne({
      where: { id: extraId, eventoId: eventId },
    });
    if (!extraEntity) {
      throw new NotFoundException('Extra não encontrado para este evento.');
    }

    const { page = 1, limit = 10, order = OrderEnum.DESC } = paginationDto;

    const [items, total] = await this.extraParticipanteRepo.findAndCount({
      where: {
        extraId,
        credenciamentoRealizado: true,
        inscricao: { eventoId: eventId },
      },
      relations: {
        inscricao: {
          participante: { dados: true },
          modalidade: true,
        },
      },
      order: { credenciamentoEm: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = items.map((item) => ({
      ...this.checkInResponse(item.inscricao),
      inscricaoId: item.inscricaoId,
      extra: {
        id: extraEntity.id,
        nome: extraEntity.nome,
        descricao: extraEntity.descricao,
      },
      credenciadoEm: item.credenciamentoEm,
    }));

    return {
      data,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  private checkInResponse(enrollment: Inscricao) {
    const dados = enrollment.participante.dados;

    return {
      participante: {
        id: enrollment.participanteId,
        ativo: enrollment.participante.ativo,
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        estado: dados.estado,
        cidade: dados.cidade,
        pais: dados.pais,
      },
      modalidade: {
        nome: enrollment.modalidade?.nome ?? null,
        documentosExigidos: enrollment.modalidade?.documentosExigidos ?? null,
      },
      status: enrollment.statusDoParticipante,
      credenciado: enrollment.credenciamentoRealizado,
    };
  }

  private async findEnrollmentForCheckIn(
    eventId: string,
    qrCodeToken: string,
    options: { withExtras?: boolean } = {},
  ): Promise<Inscricao> {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const relations: FindOptionsRelations<Inscricao> = {
      participante: { dados: true },
      modalidade: true,
    };
    if (options.withExtras) {
      relations.extras = { extra: true };
    }

    const enrollment = await this.enrollmentRepo.findOne({
      where: { eventoId: eventId, qrCodeToken },
      relations,
    });
    if (!enrollment) {
      throw new NotFoundException(
        'Inscrição não encontrada para o QR code fornecido.',
      );
    }

    if (enrollment.statusDoParticipante !== StatusInscricaoEnum.Confirmado) {
      throw new BadRequestException(
        'Inscrição não está confirmada para credenciamento.',
      );
    }

    return enrollment;
  }
}
