import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteOrganizadores } from 'src/core/entities/cliente/cliente-organizadores.entity';

@Injectable()
export class OrganizadorJwtStrategy extends PassportStrategy(
  Strategy,
  'organizador',
) {
  constructor(
    @InjectRepository(ClienteOrganizadores)
    private readonly organizadoresRepo: Repository<ClienteOrganizadores>,
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não definido no ambiente');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string }): Promise<ClienteOrganizadores> {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    const organizador = await this.organizadoresRepo.findOne({
      where: { id: payload.sub },
      relations: ['role'],
    });

    if (!organizador) throw new UnauthorizedException('Token inválido');
    if (!organizador.ativo) throw new UnauthorizedException('Usuário inativo');
    if (!organizador.role)
      throw new UnauthorizedException('Permissão não definida');

    return organizador;
  }
}
