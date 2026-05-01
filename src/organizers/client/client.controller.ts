import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { GetUser } from 'src/core/decorators/user.decorator';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { Roles } from 'src/core/decorators/roles.decorator';
import { OrganizadorAuthGuard } from 'src/core/guards/organizador-auth.guard';
import { ClienteOrganizadores } from 'src/core/entities/cliente/cliente-organizadores.entity';

@UseGuards(OrganizadorAuthGuard)
@Roles(OrganizadorRolesEnum.Admin)
@Controller('organizers/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('me')
  findMe(@GetUser() user: ClienteOrganizadores) {
    return this.clientService.findOrganizadorById(user.id);
  }
}
