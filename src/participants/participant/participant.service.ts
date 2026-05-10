import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participante } from 'src/core/entities/participante/participante.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ParticipanteDados } from 'src/core/entities/participante/participante-dados.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participante)
    private readonly participantRepository: Repository<Participante>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const contextRunner = this.dataSource.createQueryRunner();
    await contextRunner.startTransaction();
    try {
      const participant = new Participante();
      participant.createdBy = participant.updatedBy = process.env.SYSTEM_UUIID!;
      // Verificar depois o porque o participante é string | undefined.

      const participantCreated = await contextRunner.manager.save(
        Participante,
        participant,
      );

      participantCreated.dados = await contextRunner.manager.save(
        ParticipanteDados,
        {
          participanteId: participantCreated.id,
          createdBy: process.env.SYSTEM_UUIID,
          updatedBy: process.env.SYSTEM_UUIID,
          ...createParticipantDto,
        },
      );

      await contextRunner.commitTransaction();

      return plainToInstance(Participante, participantCreated);
    } catch (error) {
      await contextRunner.rollbackTransaction();
      throw error;
    } finally {
      await contextRunner.release();
    }
  }

  async findByEmail(email: string) {
    return this.participantRepository
      .createQueryBuilder('participante')
      .leftJoinAndSelect('participante.dados', 'participante_dados')
      .leftJoinAndSelect(
        'participante_dados.setor',
        'participante_areas_profissionais_categorias',
      )
      .leftJoinAndSelect(
        'participante_dados.escolaridade',
        'participante_escolaridade_categorias',
      )
      .where('participante_dados.email = :email', { email: email })
      .andWhere('participante.deletedAt IS NULL')
      .getOne();
  }

  async findById(id: string) {
    return this.participantRepository
      .createQueryBuilder('participante')
      .leftJoinAndSelect('participante.dados', 'participante_dados')
      .leftJoinAndSelect(
        'participante_dados.setor',
        'participante_areas_profissionais_categorias',
      )
      .leftJoinAndSelect(
        'participante_dados.escolaridade',
        'participante_escolaridade_categorias',
      )
      .where('participante.id = :id', { id })
      .andWhere('participante.deletedAt IS NULL')
      .getOne();
  }
}
