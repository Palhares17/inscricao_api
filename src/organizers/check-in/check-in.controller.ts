import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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

@ApiTags('Check-in')
@ApiBearerAuth('access-token')
@ApiParam({
  name: 'eventoId',
  description: 'UUID do evento ao qual o credenciamento pertence.',
  format: 'uuid',
})
@ApiResponse({ status: 401, description: 'Token ausente, inválido ou expirado.' })
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
    summary: 'Valida um QR code de credenciamento e retorna os dados do inscrito.',
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
  @ApiResponse({ status: 200, description: 'Credenciamento confirmado com sucesso.' })
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
}
