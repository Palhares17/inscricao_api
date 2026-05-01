import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { OrganizadorRolesEnum } from '../enum/organizador-roles.enum';
import { ClienteOrganizadores } from '../entities/cliente/cliente-organizadores.entity';

@Injectable()
export class OrganizadorAuthGuard extends AuthGuard('organizador') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser = ClienteOrganizadores>(
    err: any,
    user: ClienteOrganizadores,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      throw err || new UnauthorizedException('Autenticação necessária');
    }

    if (!user.role) {
      throw new ForbiddenException('Perfil de acesso não configurado');
    }

    const requiredRoles =
      this.reflector.get<OrganizadorRolesEnum[]>(
        'roles',
        context.getHandler(),
      ) || [];

    if (requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) => user.role.nome === role);

      if (!hasRole) {
        throw new ForbiddenException(
          'Você não tem permissão para acessar o recurso',
        );
      }
    }

    return user as TUser;
  }
}
