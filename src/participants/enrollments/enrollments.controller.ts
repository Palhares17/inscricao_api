import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { GetUser } from 'src/core/decorators/user.decorator';
import { Participante } from 'src/core/entities/participante/participante.entity';
import { ParticipanteAuthGuard } from 'src/core/guards/participante-auth.guard';

@ApiTags('Inscrições')
@ApiBearerAuth('access-token')
@Controller('inscricoes')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('/:eventoId/inscricao')
  @UseGuards(ParticipanteAuthGuard)
  create(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @GetUser() participant: Participante,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentsService.create(
      eventId,
      participant.id,
      createEnrollmentDto,
    );
  }

  @Get('/participante')
  @UseGuards(ParticipanteAuthGuard)
  findAll(@GetUser() participant: Participante) {
    return this.enrollmentsService.findAll(participant.id);
  }

  @Get('/:inscricaoId')
  @UseGuards(ParticipanteAuthGuard)
  findOne(
    @Param('inscricaoId', ParseUUIDPipe) enrollmentId: string,
    @GetUser() participant: Participante,
  ) {
    return this.enrollmentsService.findOne(enrollmentId, participant.id);
  }

  // remover inscrição (cancelar)
}
