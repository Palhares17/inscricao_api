import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { OrganizadorAuthGuard } from 'src/core/guards/organizador-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { PaginationDto } from 'src/core/utils/pagination.dto';

@ApiTags('Check-in')
@ApiBearerAuth('access-token')
@ApiParam({
  name: 'eventoId',
  description: 'UUID do evento ao qual o credenciamento pertence.',
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
@Controller('eventos/:eventoId/check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post('validar')
  @UseGuards(OrganizadorAuthGuard)
  @ApiOperation({
    summary:
      'Valida um QR code de credenciamento e retorna os dados do inscrito.',
    description:
      'Procura a inscrição pelo `qrCodeToken` amarrado ao `eventoId` da URL. Retorna nome, modalidade e status atual do credenciamento. Não altera estado.',
  })
  @ApiResponse({ status: 200, description: 'Inscrição encontrada e validada.' })
  @ApiResponse({
    status: 400,
    description: 'QR code inválido ou inscrição não confirmada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou inscrição não encontrada para o QR code informado.',
  })
  validate(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Body() createCheckInDto: CreateCheckInDto,
  ) {
    return this.checkInService.validate(eventId, createCheckInDto);
  }

  @Patch('confirmar')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Confirma o credenciamento da inscrição associada ao QR code.',
    description:
      'Marca `credenciamentoRealizado = true` e preenche `credenciamentoEm`. Retorna `400` se o credenciamento já tiver sido realizado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credenciamento confirmado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Credenciamento já realizado ou inscrição não está confirmada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou inscrição não encontrada para o QR code informado.',
  })
  confirm(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Body() createCheckInDto: CreateCheckInDto,
  ) {
    return this.checkInService.confirm(eventId, createCheckInDto);
  }

  @Post('checkin-manual')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Realiza o credenciamento manual de um participante.',
    description:
      'Permite que o organizador informe o email do participante para realizar o credenciamento manualmente. Retorna os mesmos dados da validação por QR code. Retorna `400` se o participante não tiver inscrição confirmada ou já tiver sido credenciado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credenciamento manual realizado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Participante sem inscrição confirmada ou já credenciado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou participante não encontrado.',
  })
  manualCheckIn(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Body('participantId') participantId: string,
  ) {
    return this.checkInService.manualCheckIn(eventId, participantId);
  }

  @Patch('cancelar')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Cancela o credenciamento da inscrição associada ao QR code.',
    description:
      'Reverte `credenciamentoRealizado` para `false` e limpa `credenciamentoEm`. Retorna `400` se o credenciamento ainda não tiver sido realizado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credenciamento cancelado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Credenciamento ainda não realizado ou inscrição não está confirmada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou inscrição não encontrada para o QR code informado.',
  })
  cancel(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Body() createCheckInDto: CreateCheckInDto,
  ) {
    return this.checkInService.cancel(eventId, createCheckInDto);
  }

  @Get('/extra/:extraId/credenciados')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Lista paginada de credenciados em um extra específico.',
    description:
      'Retorna a paginação no formato `IPaginatedResult` (`data`, `totalItems`, `totalPages`, `currentPage`, `itemsPerPage`). Cada item inclui `participante`, `modalidade`, `inscricaoId`, `extra` (id/nome/descricao) e `credenciadoEm`. Ordenado por `credenciamentoEm` (DESC por padrão).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada retornada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou extra não encontrado.',
  })
  listExtraCrendentials(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.checkInService.ListExtraCrendentials(
      eventId,
      extraId,
      paginationDto,
    );
  }

  @Post('/extra/:extraId/validar')
  @UseGuards(OrganizadorAuthGuard)
  @ApiOperation({
    summary: 'Valida um QR code de credenciamento para um extra específico.',
    description:
      'Procura a inscrição pelo `qrCodeToken` amarrado ao `eventoId` e `extraId` da URL. Retorna nome, modalidade e status atual do credenciamento para aquele extra. Não altera estado.',
  })
  @ApiResponse({ status: 200, description: 'Inscrição encontrada e validada.' })
  @ApiResponse({
    status: 400,
    description: 'QR code inválido ou inscrição não confirmada para o extra.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Evento, extra ou inscrição não encontrada para o QR code informado.',
  })
  validateExtra(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
    @Body() createCheckInDto: CreateCheckInDto,
  ) {
    return this.checkInService.validateExtra(
      eventId,
      extraId,
      createCheckInDto,
    );
  }

  @Post('/extra/:extraId/confirmar')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Confirma o credenciamento para um extra específico.',
    description:
      'Marca `credenciamentoRealizado = true` e preenche `credenciamentoEm` no vínculo `inscricao_extra_participante`. Retorna `400` se o credenciamento do extra já tiver sido realizado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credenciamento do extra confirmado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Credenciamento do extra já realizado ou inscrição não está confirmada para o extra.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Evento, extra ou inscrição não encontrada para o QR code informado.',
  })
  confirmExtra(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
    @Body() createCheckInDto: CreateCheckInDto,
  ) {
    return this.checkInService.confirmExtra(eventId, extraId, createCheckInDto);
  }

  @Patch('/extra/:extraId/cancelar')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Cancela o credenciamento da inscrição em um extra específico.',
    description:
      'Reverte `credenciamentoRealizado` para `false` e limpa `credenciamentoEm` no vínculo `inscricao_extra_participante`. Retorna `400` se o credenciamento do extra ainda não tiver sido realizado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credenciamento do extra cancelado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Credenciamento do extra ainda não realizado ou inscrição não está confirmada.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Evento, extra ou inscrição não encontrada para o QR code informado.',
  })
  cancelExtra(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
    @Body() createCheckInDto: CreateCheckInDto,
  ) {
    return this.checkInService.cancelExtra(eventId, extraId, createCheckInDto);
  }

  @Get('credenciados')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary:
      'Lista paginada de inscrições com credenciamento realizado no evento.',
    description:
      'Retorna a paginação no formato `IPaginatedResult` (`data`, `totalItems`, `totalPages`, `currentPage`, `itemsPerPage`). Cada item inclui `participante`, `modalidade`, `inscricaoId`, `status` e `credenciadoEm`. Ordenado por `credenciamentoEm` (DESC por padrão).',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  listEventCredenciados(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.checkInService.listEventCrendentials(eventId, paginationDto);
  }

  @Post('extra/:extraId/checkin-manual')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Realiza o credenciamento manual em um extra específico.',
    description:
      'Permite que o organizador informe o email do participante para realizar o credenciamento manualmente em um extra. Retorna os mesmos dados da validação por QR code para aquele extra. Retorna `400` se o participante não tiver inscrição confirmada para o extra ou já tiver sido credenciado no extra.',
  })
  @ApiResponse({
    status: 200,
    description: 'Credenciamento manual do extra realizado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Participante sem inscrição confirmada para o extra ou já credenciado no extra.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento, extra ou participante não encontrado.',
  })
  manualCheckInExtra(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
    @Body('participantId') participantId: string,
  ) {
    return this.checkInService.manualCheckInExtra(
      eventId,
      extraId,
      participantId,
    );
  }
}
