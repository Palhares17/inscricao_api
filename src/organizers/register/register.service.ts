import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { CreateRegisterDto } from './dto/create-register.dto';
import { InscricaoModalidade } from 'src/core/entities/inscricao/inscricao-modalidade.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { OrderEnum, PaginationDto } from 'src/core/utils/pagination.dto';
import { IPaginatedResult } from 'src/core/utils/pagination.interface';
import { UpdateRegisterDto } from './dto/update-register.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(InscricaoModalidade)
    private readonly registerRepo: Repository<InscricaoModalidade>,
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async createRegister(eventoId: string, createRegisterDto: CreateRegisterDto) {
    const evento = await this.eventoRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    if (createRegisterDto.dataInicioVenda >= createRegisterDto.dataFimVenda) {
      throw new BadRequestException(
        'dataInicioVenda deve ser anterior a dataFimVenda.',
      );
    }

    const isPaid = createRegisterDto.gratuito === false;

    if (isPaid) {
      if (
        createRegisterDto.preco === undefined ||
        createRegisterDto.preco === null ||
        createRegisterDto.preco <= 0
      ) {
        throw new BadRequestException(
          'Modalidade paga exige preco maior que 0.',
        );
      }
      if (
        !createRegisterDto.metodosPagamento ||
        createRegisterDto.metodosPagamento.length === 0
      ) {
        throw new BadRequestException(
          'Modalidade paga exige ao menos um método de pagamento.',
        );
      }
    } else {
      if (
        createRegisterDto.preco !== undefined &&
        createRegisterDto.preco !== null &&
        createRegisterDto.preco !== 0
      ) {
        throw new BadRequestException(
          'Modalidade gratuita não pode ter preço maior que 0.',
        );
      }
      if (
        createRegisterDto.metodosPagamento &&
        createRegisterDto.metodosPagamento.length > 0
      ) {
        throw new BadRequestException(
          'Modalidade gratuita não deve ter métodos de pagamento.',
        );
      }
    }

    const data: DeepPartial<InscricaoModalidade> = {
      eventoId,
      nome: createRegisterDto.nome,
      descricao: createRegisterDto.descricao,
      gratuito: createRegisterDto.gratuito,
      preco: isPaid ? createRegisterDto.preco! : null,
      vagas: createRegisterDto.vagas,
      dataInicioVenda: createRegisterDto.dataInicioVenda,
      dataFimVenda: createRegisterDto.dataFimVenda,
      documentosExigidos: createRegisterDto.documentosExigidos ?? null,
      metodosPagamento: isPaid ? createRegisterDto.metodosPagamento! : null,
    };
    const modalidade = this.registerRepo.create(data);
    const saved = await this.registerRepo.save(modalidade);

    return {
      data: {
        id: saved.id,
        nome: saved.nome,
        gratuito: saved.gratuito,
        preco: saved.preco,
        vagas: saved.vagas,
        vagasUtilizadas: saved.vagasUtilizadas,
        dataInicioVenda: saved.dataInicioVenda,
        dataFimVenda: saved.dataFimVenda,
        documentosExigidos: saved.documentosExigidos,
        metodosPagamento: saved.metodosPagamento,
      },
    };
  }

  async findRegisters(
    paginationDto: PaginationDto,
    eventoId: string,
  ): Promise<IPaginatedResult<InscricaoModalidade>> {
    const evento = await this.eventoRepository.findOne({
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

    const [items, total] = await this.registerRepo.findAndCount({
      where: {
        eventoId,
        nome: search ? ILike(`%${search}%`) : undefined,
      },
      order: { createdAt: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const pagination: IPaginatedResult<InscricaoModalidade> = {
      data: items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      itemsPerPage: limit,
    };

    return pagination;
  }

  async updateRegister(
    eventoId: string,
    modalidadeId: string,
    updateRegisterDto: UpdateRegisterDto,
  ) {
    const evento = await this.eventoRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const modalidade = await this.registerRepo.findOne({
      where: { id: modalidadeId, eventoId },
    });
    if (!modalidade) {
      throw new NotFoundException(
        'Modalidade não encontrada para este evento.',
      );
    }

    const updateRegister = {
      nome: updateRegisterDto.nome ?? modalidade.nome,
      descricao: updateRegisterDto.descricao ?? modalidade.descricao,
      gratuito: updateRegisterDto.gratuito ?? modalidade.gratuito,
      preco:
        updateRegisterDto.preco !== undefined
          ? updateRegisterDto.preco
          : modalidade.preco,
      vagas: updateRegisterDto.vagas ?? modalidade.vagas,
      dataInicioVenda:
        updateRegisterDto.dataInicioVenda ?? modalidade.dataInicioVenda,
      dataFimVenda: updateRegisterDto.dataFimVenda ?? modalidade.dataFimVenda,
      documentosExigidos:
        updateRegisterDto.documentosExigidos !== undefined
          ? updateRegisterDto.documentosExigidos
          : modalidade.documentosExigidos,
      metodosPagamento:
        updateRegisterDto.metodosPagamento !== undefined
          ? updateRegisterDto.metodosPagamento
          : modalidade.metodosPagamento,
    };

    if (updateRegister.dataInicioVenda >= updateRegister.dataFimVenda) {
      throw new BadRequestException(
        'dataInicioVenda deve ser anterior a dataFimVenda.',
      );
    }

    if (updateRegister.gratuito) {
      updateRegister.preco = null;
      updateRegister.metodosPagamento = null;
    } else {
      if (updateRegister.preco === null || updateRegister.preco === undefined || updateRegister.preco <= 0) {
        throw new BadRequestException(
          'Modalidade paga exige preco maior que 0.',
        );
      }
      if (!updateRegister.metodosPagamento || updateRegister.metodosPagamento.length === 0) {
        throw new BadRequestException(
          'Modalidade paga exige ao menos um método de pagamento.',
        );
      }
    }

    return this.registerRepo.save({ ...modalidade, ...updateRegister });
  }

  async deleteRegister(eventoId: string, modalidadeId: string) {
    const evento = await this.eventoRepository.findOne({
      where: { id: eventoId },
    });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const modalidade = await this.registerRepo.findOne({
      where: { id: modalidadeId, eventoId },
    });
    if (!modalidade) {
      throw new NotFoundException(
        'Modalidade não encontrada para este evento.',
      );
    }

    await this.registerRepo.remove(modalidade);
  }
}
