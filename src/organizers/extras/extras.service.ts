import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { InscricaoExtra } from 'src/core/entities/inscricao/inscricao-extra.entity';
import { OrderEnum, PaginationDto } from 'src/core/utils/pagination.dto';
import { IPaginatedResult } from 'src/core/utils/pagination.interface';

@Injectable()
export class ExtrasService {
  constructor(
    @InjectRepository(InscricaoExtra)
    private readonly extraRepo: Repository<InscricaoExtra>,
    @InjectRepository(Evento)
    private readonly eventRepository: Repository<Evento>,
  ) {}

  async create(eventoId: string, createExtraDto: CreateExtraDto) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (createExtraDto.dataInicioVenda >= createExtraDto.dataFimVenda) {
      throw new BadRequestException(
        'dataInicioVenda deve ser anterior a dataFimVenda.',
      );
    }

    if (createExtraDto.dataInicioDoExtra >= createExtraDto.dataFimDoExtra) {
      throw new BadRequestException(
        'dataInicioDoExtra deve ser anterior a dataFimDoExtra.',
      );
    }

    const isPaid = createExtraDto.gratuito === false;

    if (isPaid) {
      if (
        createExtraDto.preco === undefined ||
        createExtraDto.preco === null ||
        createExtraDto.preco <= 0
      ) {
        throw new BadRequestException('Extra pago exige preco maior que 0.');
      }
    } else {
      if (
        createExtraDto.preco !== undefined &&
        createExtraDto.preco !== null &&
        createExtraDto.preco !== 0
      ) {
        throw new BadRequestException(
          'Extra gratuito não pode ter preço maior que 0.',
        );
      }
    }

    if (createExtraDto.vaiTerCertificado) {
      if (
        createExtraDto.cargaHoraria === undefined ||
        createExtraDto.cargaHoraria === null
      ) {
        throw new BadRequestException(
          'Extra com certificado exige cargaHoraria.',
        );
      }
    } else if (
      createExtraDto.cargaHoraria !== undefined &&
      createExtraDto.cargaHoraria !== null
    ) {
      throw new BadRequestException(
        'Extra sem certificado não deve ter cargaHoraria.',
      );
    }

    const data: DeepPartial<InscricaoExtra> = {
      eventoId,
      nome: createExtraDto.nome,
      descricao: createExtraDto.descricao ?? null,
      gratuito: createExtraDto.gratuito,
      preco: isPaid ? createExtraDto.preco! : null,
      vagas: createExtraDto.vagas,
      vaiTerCertificado: createExtraDto.vaiTerCertificado,
      exigeCredenciamento: createExtraDto.exigeCredenciamento ?? true,
      cargaHoraria: createExtraDto.vaiTerCertificado
        ? createExtraDto.cargaHoraria!
        : (null as unknown as Date),
      dataInicioDoExtra: createExtraDto.dataInicioDoExtra,
      dataFimDoExtra: createExtraDto.dataFimDoExtra,
      dataInicioVenda: createExtraDto.dataInicioVenda,
      dataFimVenda: createExtraDto.dataFimVenda,
    };

    const extra = this.extraRepo.create(data);
    const saved = await this.extraRepo.save(extra);

    return {
      data: {
        id: saved.id,
        nome: saved.nome,
        descricao: saved.descricao,
        gratuito: saved.gratuito,
        preco: saved.preco,
        vagas: saved.vagas,
        vagasUtilizadas: saved.vagasUtilizadas,
        vaiTerCertificado: saved.vaiTerCertificado,
        exigeCredenciamento: saved.exigeCredenciamento,
        cargaHoraria: saved.cargaHoraria,
        dataInicioDoExtra: saved.dataInicioDoExtra,
        dataFimDoExtra: saved.dataFimDoExtra,
        dataInicioVenda: saved.dataInicioVenda,
        dataFimVenda: saved.dataFimVenda,
      },
    };
  }

  async findAll(
    paginationDto: PaginationDto,
    eventoId: string,
  ): Promise<IPaginatedResult<InscricaoExtra>> {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const {
      page = 1,
      limit = 10,
      order = OrderEnum.DESC,
      search,
    } = paginationDto;

    const [items, total] = await this.extraRepo.findAndCount({
      where: {
        eventoId,
        nome: search ? ILike(`%${search}%`) : undefined,
      },
      order: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pagination: IPaginatedResult<InscricaoExtra> = {
      data: items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    };

    return pagination;
  }

  async findOne(eventoId: string, extraId: string) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const extra = await this.extraRepo.findOne({
      where: { id: extraId, eventoId },
    });
    if (!extra) {
      throw new NotFoundException('Extra não encontrado para este evento.');
    }

    return { data: extra };
  }

  async update(
    eventoId: string,
    extraId: string,
    updateExtraDto: UpdateExtraDto,
  ) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const extra = await this.extraRepo.findOne({
      where: { id: extraId, eventoId },
    });
    if (!extra) {
      throw new NotFoundException('Extra não encontrado para este evento.');
    }

    const updateExtra = {
      nome: updateExtraDto.nome ?? extra.nome,
      descricao:
        updateExtraDto.descricao !== undefined
          ? updateExtraDto.descricao
          : extra.descricao,
      gratuito: updateExtraDto.gratuito ?? extra.gratuito,
      preco:
        updateExtraDto.preco !== undefined
          ? updateExtraDto.preco
          : extra.preco,
      vagas: updateExtraDto.vagas ?? extra.vagas,
      vaiTerCertificado:
        updateExtraDto.vaiTerCertificado ?? extra.vaiTerCertificado,
      exigeCredenciamento:
        updateExtraDto.exigeCredenciamento ?? extra.exigeCredenciamento,
      cargaHoraria:
        updateExtraDto.cargaHoraria !== undefined
          ? updateExtraDto.cargaHoraria
          : extra.cargaHoraria,
      dataInicioDoExtra:
        updateExtraDto.dataInicioDoExtra ?? extra.dataInicioDoExtra,
      dataFimDoExtra: updateExtraDto.dataFimDoExtra ?? extra.dataFimDoExtra,
      dataInicioVenda:
        updateExtraDto.dataInicioVenda ?? extra.dataInicioVenda,
      dataFimVenda: updateExtraDto.dataFimVenda ?? extra.dataFimVenda,
    };

    if (updateExtra.dataInicioVenda >= updateExtra.dataFimVenda) {
      throw new BadRequestException(
        'dataInicioVenda deve ser anterior a dataFimVenda.',
      );
    }

    if (updateExtra.dataInicioDoExtra >= updateExtra.dataFimDoExtra) {
      throw new BadRequestException(
        'dataInicioDoExtra deve ser anterior a dataFimDoExtra.',
      );
    }

    if (updateExtra.gratuito) {
      updateExtra.preco = null;
    } else {
      if (
        updateExtra.preco === null ||
        updateExtra.preco === undefined ||
        updateExtra.preco <= 0
      ) {
        throw new BadRequestException('Extra pago exige preco maior que 0.');
      }
    }

    if (updateExtra.vaiTerCertificado) {
      if (
        updateExtra.cargaHoraria === null ||
        updateExtra.cargaHoraria === undefined
      ) {
        throw new BadRequestException(
          'Extra com certificado exige cargaHoraria.',
        );
      }
    } else {
      updateExtra.cargaHoraria = null;
    }

    return this.extraRepo.save({ ...extra, ...updateExtra });
  }

  async remove(eventoId: string, extraId: string) {
    const evento = await this.eventRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const extra = await this.extraRepo.findOne({
      where: { id: extraId, eventoId },
    });
    if (!extra) {
      throw new NotFoundException('Extra não encontrado para este evento.');
    }

    await this.extraRepo.remove(extra);
  }
}
