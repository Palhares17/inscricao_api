import { SetMetadata } from '@nestjs/common';
import { OrganizadorRolesEnum } from '../enum/organizador-roles.enum';

export const Roles = (...roles: OrganizadorRolesEnum[]) =>
  SetMetadata('roles', roles);
