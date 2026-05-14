import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { InscricaoModalidade } from 'src/core/entities/inscricao/inscricao-modalidade.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(InscricaoModalidade)
    private readonly modalityRepo: Repository<InscricaoModalidade>,
    @InjectRepository(Inscricao)
    private readonly enrollmentRepo: Repository<Inscricao>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    eventId: string,
    participantId: string,
    dto: CreateEnrollmentDto,
  ) {
    const modality = await this.modalityRepo.findOne({
      where: { id: dto.modalidadeId },
    });

    if (!modality) {
      throw new NotFoundException('Modalidade não encontrada.');
    }

    if (modality.eventoId !== eventId) {
      throw new BadRequestException(
        'Modalidade não pertence ao evento informado.',
      );
    }

    const now = new Date();
    if (now < modality.dataInicioVenda || now > modality.dataFimVenda) {
      throw new BadRequestException('Modalidade fora da janela de inscrição.');
    }

    if (modality.vagasUtilizadas >= modality.vagas) {
      throw new ConflictException('Modalidade sem vagas disponíveis.');
    }

    if (
      !modality.gratuito &&
      (!modality.metodosPagamento ||
        !modality.metodosPagamento.includes(dto.metodoDePagamento))
    ) {
      throw new BadRequestException(
        'Método de pagamento não aceito por esta modalidade.',
      );
    }

    const existingEnrollment = await this.enrollmentRepo.findOne({
      where: { eventoId: eventId, participanteId: participantId },
    });

    if (existingEnrollment) {
      throw new ConflictException('Participante já inscrito neste evento.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(InscricaoModalidade)
        .set({ vagasUtilizadas: () => '"vagasUtilizadas" + 1' })
        .where('id = :id', { id: modality.id })
        .andWhere('"vagasUtilizadas" < "vagas"')
        .execute();

      if (!updateResult.affected) {
        throw new ConflictException('Modalidade sem vagas disponíveis.');
      }

      const enrollment = queryRunner.manager.create(Inscricao, {
        eventoId: eventId,
        participanteId: participantId,
        modalidadeId: modality.id,
        statusDoParticipante: modality.gratuito
          ? 'confirmado'
          : 'aguardando_pagamento',
      });

      const saved = await queryRunner.manager.save(Inscricao, enrollment);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(participantId: string) {
    return this.enrollmentRepo.find({
      where: { participanteId: participantId },
      relations: ['participante', 'modalidade', 'evento'],
    });
  }

  async findOne(inscricaoId: string, participantId: string) {
    const enrollment = await this.enrollmentRepo.findOne({
      where: { id: inscricaoId, participanteId: participantId },
      relations: ['modalidade', 'evento', 'certificado'],
    });
    if (!enrollment) {
      throw new NotFoundException('Inscrição não encontrada.');
    }
    return enrollment;
  }
}
