import {
  Body,
  Controller,
  Delete,
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
import { CreateRegisterDto } from './dto/create-register.dto';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { OrganizadorAuthGuard } from 'src/core/guards/organizador-auth.guard';
import { PaginationDto } from 'src/core/utils/pagination.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';
import { CategoryService } from './category.service';

@ApiTags('Modalidades de Inscrição')
@ApiBearerAuth('access-token')
@ApiParam({
  name: 'eventoId',
  description: 'UUID do evento ao qual a modalidade pertence.',
  format: 'uuid',
})
@ApiResponse({ status: 401, description: 'Token ausente, inválido ou expirado.' })
@ApiResponse({ status: 403, description: 'Usuário não tem permissão para esta operação.' })
@Controller(':eventoId')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('modalidade')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Cria uma nova modalidade de inscrição para um evento.',
    description:
      'Apenas usuários com papel `admin` podem criar modalidades. Regras: modalidade paga exige `preco > 0` e ao menos um item em `metodosPagamento`; modalidade gratuita exige `preco` e `metodosPagamento` nulos.',
  })
  @ApiResponse({ status: 201, description: 'Modalidade criada com sucesso.' })
  @ApiResponse({
    status: 400,
    description:
      'Body inválido, regras de negócio violadas (ex.: preço em modalidade gratuita) ou `dataInicioVenda` posterior a `dataFimVenda`.',
  })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  create(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() createRegisterDto: CreateRegisterDto,
  ) {
    return this.categoryService.createRegister(eventoId, createRegisterDto);
  }

  @Get('modalidades')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  @ApiOperation({
    summary: 'Lista paginada das modalidades de um evento.',
    description:
      'Retorna a paginação no formato `IPaginatedResult` (`data`, `totalItems`, `totalPages`, `currentPage`, `itemsPerPage`). Aceita filtro por nome via parâmetro `search`.',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Evento não encontrado.' })
  findAllRestiter(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Query() paginacaoDTO: PaginationDto
  ) {
    return this.categoryService.findRegisters(paginacaoDTO, eventoId);
  }

  @Patch('modalidade/:modalidadeId')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Atualiza parcialmente uma modalidade existente.',
    description:
      'Aceita PATCH parcial — envie apenas os campos que deseja alterar. Quando `gratuito` é alterado para `true`, o servidor zera automaticamente `preco` e `metodosPagamento`. Quando alterado para `false`, ambos passam a ser obrigatórios no estado final.',
  })
  @ApiParam({
    name: 'modalidadeId',
    description: 'UUID da modalidade a ser atualizada.',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Modalidade atualizada com sucesso.' })
  @ApiResponse({
    status: 400,
    description:
      'Body inválido, campos não permitidos (ex.: `vagasUtilizadas`) ou regras de negócio violadas no estado final.',
  })
  @ApiResponse({ status: 404, description: 'Evento ou modalidade não encontrada.' })
  update(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('modalidadeId', ParseUUIDPipe) modalidadeId: string,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.categoryService.updateRegister(
      eventoId,
      modalidadeId,
      updateRegisterDto,
    );
  }

  @Delete('modalidade/:modalidadeId')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  @ApiOperation({
    summary: 'Remove uma modalidade de um evento.',
    description: 'Operação restrita a `admin`.',
  })
  @ApiParam({
    name: 'modalidadeId',
    description: 'UUID da modalidade a ser removida.',
    format: 'uuid',
  })
  @ApiResponse({ status: 200, description: 'Modalidade removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Evento ou modalidade não encontrada.' })
  delete(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('modalidadeId', ParseUUIDPipe) modalidadeId: string,
  ) {
    return this.categoryService.deleteRegister(eventoId, modalidadeId);
  }
}
