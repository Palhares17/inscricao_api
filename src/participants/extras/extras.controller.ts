import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
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
import { ExtrasService } from './extras.service';
import { ParticipanteAuthGuard } from 'src/core/guards/participante-auth.guard';
import { GetUser } from 'src/core/decorators/user.decorator';
import { Participante } from 'src/core/entities/participante/participante.entity';
import { CreateExtraDto } from './dto/create-extra.dto';

@ApiTags('Extras (Participante)')
@ApiBearerAuth('access-token')
@Controller('extras')
export class ExtrasController {
  constructor(private readonly extrasService: ExtrasService) {}

  @Get(':eventoId')
  @UseGuards(ParticipanteAuthGuard)
  @ApiOperation({
    summary: 'Lista os extras disponíveis para um evento.',
    description:
      'Retorna todas as atividades extras vinculadas ao evento, ordenadas pela data de início.',
  })
  @ApiParam({
    name: 'eventoId',
    description: 'UUID do evento.',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Lista de extras retornada.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  findAll(@Param('eventoId', ParseUUIDPipe) eventoId: string) {
    return this.extrasService.findAllByEvent(eventoId);
  }

  @Post(':extraId/cadastro')
  @UseGuards(ParticipanteAuthGuard)
  @ApiOperation({
    summary: 'Cadastra o participante logado em um extra.',
    description:
      'Cria o vínculo entre a inscrição do participante no evento e o extra. Exige que o participante já esteja inscrito no evento do extra. Valida janela de venda, vagas disponíveis e duplicidade.',
  })
  @ApiParam({
    name: 'extraId',
    description: 'UUID do extra.',
    format: 'uuid',
  })
  @ApiResponse({ status: 201, description: 'Cadastro no extra realizado.' })
  @ApiResponse({
    status: 400,
    description:
      'Participante não inscrito no evento ou extra fora da janela de venda.',
  })
  @ApiResponse({
    status: 404,
    description: 'Extra não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Extra sem vagas disponíveis ou participante já cadastrado neste extra.',
  })
  create(
    @Param('extraId', ParseUUIDPipe) extraId: string,
    @GetUser() participant: Participante,
    @Body() createExtraDto: CreateExtraDto,
  ) {
    return this.extrasService.create(extraId, participant.id, createExtraDto);
  }
}
