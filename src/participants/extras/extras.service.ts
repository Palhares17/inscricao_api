import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { InscricaoExtra } from 'src/core/entities/inscricao/inscricao-extra.entity';
import { InscricaoExtraParticipante } from 'src/core/entities/inscricao/inscricao-extra-participante.entity';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { CreateExtraDto } from './dto/create-extra.dto';

@Injectable()
export class ExtrasService {
  constructor(
    @InjectRepository(InscricaoExtra)
    private readonly extraRepo: Repository<InscricaoExtra>,
    @InjectRepository(Inscricao)
    private readonly inscricaoRepo: Repository<Inscricao>,
    @InjectRepository(Evento)
    private readonly eventoRepo: Repository<Evento>,
    private readonly dataSource: DataSource,
  ) {}

  async findAllByEvent(eventoId: string) {
    const evento = await this.eventoRepo.findOne({ where: { id: eventoId } });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado.');
    }

    const extras = await this.extraRepo.find({
      where: { eventoId },
      order: { dataInicioDoExtra: 'ASC' },
    });

    return { data: extras };
  }

  async create(
    extraId: string,
    participantId: string,
    createExtraDto: CreateExtraDto,
  ) {
    const extra = await this.extraRepo.findOne({ where: { id: extraId } });
    if (!extra) {
      throw new NotFoundException('Extra não encontrado.');
    }

    const inscricao = await this.inscricaoRepo.findOne({
      where: {
        eventoId: extra.eventoId,
        participanteId: participantId,
      },
    });
    if (!inscricao) {
      throw new BadRequestException(
        'Participante não está inscrito no evento deste extra.',
      );
    }

    if (!extra.gratuito && (!extra.preco || extra.preco <= 0)) {
      throw new BadRequestException(
        'Método de pagamento não aceito por esta modalidade.',
      );
    }

    const now = new Date();
    if (now < extra.dataInicioVenda || now > extra.dataFimVenda) {
      throw new BadRequestException('Extra fora da janela de inscrição.');
    }

    if (extra.vagasUtilizadas >= extra.vagas) {
      throw new ConflictException('Extra sem vagas disponíveis.');
    }

    const existing = await this.dataSource
      .getRepository(InscricaoExtraParticipante)
      .findOne({
        where: { inscricaoId: inscricao.id, extraId: extra.id },
      });
    if (existing) {
      throw new ConflictException('Participante já cadastrado neste extra.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const updateResult = await queryRunner.manager
        .createQueryBuilder()
        .update(InscricaoExtra)
        .set({ vagasUtilizadas: () => '"vagasUtilizadas" + 1' })
        .where('id = :id', { id: extra.id })
        .andWhere('"vagasUtilizadas" < "vagas"')
        .execute();

      if (!updateResult.affected) {
        throw new ConflictException('Extra sem vagas disponíveis.');
      }

      const participacao = queryRunner.manager.create(
        InscricaoExtraParticipante,
        {
          inscricaoId: inscricao.id,
          extraId: extra.id,
        },
      );

      const saved = await queryRunner.manager.save(
        InscricaoExtraParticipante,
        participacao,
      );
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
