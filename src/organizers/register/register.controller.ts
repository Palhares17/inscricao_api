import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { OrganizadorAuthGuard } from 'src/core/guards/organizador-auth.guard';
import { PaginationDto } from 'src/core/utils/pagination.dto';
import { UpdateRegisterDto } from './dto/update-register.dto';

@Controller('eventos/:eventoId')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('modalidade')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  create(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() createRegisterDto: CreateRegisterDto,
  ) {
    return this.registerService.createRegister(eventoId, createRegisterDto);
  }

  @Get('modalidades')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin, OrganizadorRolesEnum.Organizador)
  findAllRestiter(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Body() paginationDto: PaginationDto,
  ) {
    return this.registerService.findRegisters(paginationDto, eventoId);
  }

  @Patch('modalidade/:modalidadeId')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  update(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('modalidadeId', ParseUUIDPipe) modalidadeId: string,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.registerService.updateRegister(
      eventoId,
      modalidadeId,
      updateRegisterDto,
    );
  }

  @Delete('modalidade/:modalidadeId')
  @UseGuards(OrganizadorAuthGuard)
  @Roles(OrganizadorRolesEnum.Admin)
  delete(
    @Param('eventoId', ParseUUIDPipe) eventoId: string,
    @Param('modalidadeId', ParseUUIDPipe) modalidadeId: string,
  ) {
    return this.registerService.deleteRegister(eventoId, modalidadeId);
  }
}
