import { Controller, Get, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { OrganizadorGuard } from 'src/core/guards/organizador.guard';
import type { JwtPayload } from 'src/core/types/jwt-payload.type';
import { GetUser } from 'src/core/decorators/user.decorator';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { Roles } from 'src/core/decorators/roles.decorator';

@UseGuards(OrganizadorGuard)
@Roles(OrganizadorRolesEnum.Admin)
@Controller('organizers/client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('me')
  findMe(@GetUser() user: JwtPayload) {
    return this.clientService.findOrganizadorById(user.sub);
  }
}
