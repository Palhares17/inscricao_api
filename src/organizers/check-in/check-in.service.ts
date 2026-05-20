import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { Repository } from 'typeorm';
import { StatusInscricaoEnum } from 'src/core/enum/status-inscricao.enum';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(Inscricao)
    private readonly enrollmentRepo: Repository<Inscricao>,
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
  ): Promise<Inscricao> {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const enrollment = await this.enrollmentRepo.findOne({
      where: { eventoId: eventId, qrCodeToken },
      relations: { participante: { dados: true }, modalidade: true },
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
