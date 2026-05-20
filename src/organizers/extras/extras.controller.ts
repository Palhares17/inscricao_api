import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ExtrasService } from './extras.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizadorAuthGuard } from 'src/core/guards/organizador-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { PaginationDto } from 'src/core/utils/pagination.dto';

@ApiTags('Atividades Extras')
@ApiBearerAuth('access-token')
@ApiParam({
  name: 'eventoId',
  description: 'UUID do evento ao qual o extra pertence.',
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
@Controller(':eventoId')
export class ExtrasController {
  constructor(private readonly extrasService: ExtrasService) {}

  @Post('extras')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Cria uma nova atividade extra para um evento.',
    description:
      'Apenas usuários com papel `admin` podem criar extras. Regras: extra pago exige `preco > 0`; extra gratuito exige `preco` nulo; extra com certificado exige `cargaHoraria`; extra sem certificado exige `cargaHoraria` nula. Datas: `dataInicioVenda < dataFimVenda` e `dataInicioDoExtra < dataFimDoExtra`.',
  })
  @ApiResponse({ status: 201, description: 'Extra criado com sucesso.' })
  @ApiResponse({
    status: 400,
    description:
      'Body inválido, regras de negócio violadas (ex.: preço em extra gratuito, certificado sem cargaHoraria) ou datas em ordem inválida.',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  create(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() createExtraDto: CreateExtraDto,
  ) {
    return this.extrasService.create(eventoId, createExtraDto);
  }

  @Get('extras')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Lista paginada das atividades extras',
    description:
      'Retorna a paginação no formato `IPaginatedResult` (`data`, `totalItems`, `totalPages`, `currentPage`, `itemsPerPage`). Aceita filtro por nome via parâmetro `search`.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
  ) {
    return this.extrasService.findAll(paginationDto, eventoId);
  }

  @Get('extras/:extraId')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Busca uma atividade extra pelo seu UUID.',
    description:
      'Retorna o extra apenas se ele pertencer ao evento informado. Caso contrário, responde `404`.',
  })
  @ApiParam({
    name: 'extraId',
    description: 'UUID da atividade extra.',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Extra retornado com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Evento ou extra não encontrado.',
  })
  findOne(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
  ) {
    return this.extrasService.findOne(eventoId, extraId);
  }

  @Patch('extras/:extraId')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Atualiza uma atividade extra de um evento.',
    description:
      'Apenas usuários com papel `admin` podem atualizar extras. As mesmas regras do `create` são revalidadas após o merge: extra pago exige `preco > 0`, extra gratuito força `preco = null`; extra com certificado exige `cargaHoraria`, sem certificado força `cargaHoraria = null`; `dataInicioVenda` deve ser anterior a `dataFimVenda` e `dataInicioDoExtra` anterior a `dataFimDoExtra`.',
  })
  @ApiParam({
    name: 'extraId',
    description: 'UUID da atividade extra.',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Extra atualizado com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Body inválido ou regras de negócio violadas após o merge.',
  })
  @ApiResponse({
    status: 404,
    description: 'Evento ou extra não encontrado.',
  })
  update(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
    @Body() updateExtraDto: UpdateExtraDto,
  ) {
    return this.extrasService.update(eventoId, extraId, updateExtraDto);
  }

  @Delete('extras/:extraId')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Remove uma atividade extra de um evento.',
    description:
      'Apenas usuários com papel `admin` podem remover extras. A operação é irreversível.',
  })
  @ApiParam({
    name: 'extraId',
    description: 'UUID da atividade extra.',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Extra removido com sucesso.' })
  @ApiResponse({
    status: 404,
    description: 'Evento ou extra não encontrado.',
  })
  remove(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('extraId', ParseUUIDPipe) extraId: string,
  ) {
    return this.extrasService.remove(eventoId, extraId);
  }
}
