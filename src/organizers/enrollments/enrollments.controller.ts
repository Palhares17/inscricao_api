import {
  Controller,
  Get,
  Param,
  Patch,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { OrganizadorAuthGuard } from 'src/core/guards/organizador-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { PaginationDto } from 'src/core/utils/pagination.dto';

@ApiTags('Inscritos')
@ApiBearerAuth('access-token')
@ApiParam({
  name: 'eventoId',
  description: 'UUID do evento ao qual as inscrições pertencem.',
  format: 'uuid',
})
@ApiResponse({
  status: 401,
  description: 'Token ausente, inválido ou expirado.',
})
@ApiResponse({
  status: 403,
  description: 'Usuário não tem permissão para esta operação.',
})
@Controller('eventos/:eventoId')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('inscritos/contadores')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Retorna os contadores de inscrições de um evento.',
    description:
      'Retorna `total`, contagens por status (`confirmados`, `pendentes`, `cancelados`), `credenciados` (inscrições com credenciamento realizado) e `certificadosEmitidos` (certificados com `emitidoEm` preenchido).',
  })
  @ApiResponse({
    status: 200,
    description: 'Contadores retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  getCounters(@Param('eventoId', ParseUUIDPipe) eventoId: string) {
    return this.enrollmentsService.getCounters(eventoId);
  }

  @Get('inscritos/estatisticas')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Retorna estatísticas detalhadas de credenciamento do evento.',
    description:
      'Retorna `totalCredenciados`, breakdown `porModalidade` (com `totalInscritos`, `confirmados`, `credenciados` e `taxaCredenciamento`), `porExtra` (com `totalParticipantes`, `credenciados` e `taxaCredenciamento`), e séries temporais `credenciamentoPorDia` e `credenciamentoPorHora` baseadas em `credenciamentoEm`. Taxa = credenciados / (confirmados | totalParticipantes), arredondada em 4 casas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  getStatistics(@Param('eventoId', ParseUUIDPipe) eventoId: string) {
    // NOTE: The shape and breakdowns of the data returned by this endpoint
    // (per-modalidade, per-extra, daily and hourly time series) were designed by an AI.
    return this.enrollmentsService.getStatistics(eventoId);
  }

  @Get('inscritos')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Lista paginada das inscrições de um evento.',
    description:
      'Retorna a paginação no formato `IPaginatedResult` (`data`, `totalItems`, `totalPages`, `currentPage`, `itemsPerPage`). Inclui dados do participante e da modalidade.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  findEnrollments(
    @Query() paginationDto: PaginationDto,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
  ) {
    return this.enrollmentsService.findEnrollments(paginationDto, eventoId);
  }

  @Patch('inscritos/:inscricaoId/cancelar')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Cancela uma inscrição de um evento.',
    description:
      'Apenas usuários com papel `admin` podem cancelar inscrições. Define `statusDoParticipante = "cancelado"`. Retorna `400` se a inscrição já estiver cancelada.',
  })
  @ApiParam({
    name: 'inscricaoId',
    description: 'UUID da inscrição a ser cancelada.',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Inscrição cancelada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Inscrição já está cancelada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou inscrição não encontrada.',
  })
  cancelEnrollment(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('inscricaoId', ParseUUIDPipe) inscricaoId: string,
  ) {
    return this.enrollmentsService.cancelEnrollment(eventoId, inscricaoId);
  }

  @Patch('participantes/:participanteId/cancelar')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Cancela a inscrição de um participante em um evento.',
    description:
      'Localiza a inscrição pelo par (`eventoId`, `participanteId`) — único pela constraint `uq_inscricao_evento_participante` — e define `statusDoParticipante = "cancelado"`. Útil para o fluxo "remover esta pessoa do meu evento" sem precisar do `inscricaoId`. Apenas usuários com papel `admin`. Retorna `400` se já estiver cancelada e `404` se o participante não tiver inscrição no evento.',
  })
  @ApiParam({
    name: 'participanteId',
    description: 'UUID do participante cuja inscrição será cancelada.',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Inscrição cancelada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Inscrição já está cancelada.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Evento não encontrado ou participante sem inscrição neste evento.',
  })
  cancelParticipantEnrollment(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('participanteId', ParseUUIDPipe) participanteId: string,
  ) {
    return this.enrollmentsService.cancelParticipantEnrollment(
      eventoId,
      participanteId,
    );
  }
}
