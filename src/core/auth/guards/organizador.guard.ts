import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { OrganizadorRolesEnum } from 'src/core/enum/organizador-roles.enum';
import { JwtPayload } from 'src/core/types/jwt-payload.type';

const VALID_ROLES = Object.values(OrganizadorRolesEnum) as string[];

@Injectable()
export class OrganizadorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload | undefined;

    if (!user) {
      throw new UnauthorizedException('Autenticação necessária');
    }

    if (!user.role) {
      throw new ForbiddenException('Perfil de acesso não configurado');
    }

    if (!VALID_ROLES.includes(user.role)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar o recurso',
      );
    }

    const requiredRoles =
      this.reflector.get<OrganizadorRolesEnum[]>(
        'roles',
        context.getHandler(),
      ) || [];

    if (
      requiredRoles.length > 0 &&
      !requiredRoles.includes(user.role as OrganizadorRolesEnum)
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar o recurso',
      );
    }

    return true;
  }
}
