import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Participante } from 'src/core/entities/participante/participante.entity';
import { ParticipantService } from 'src/participants/participant/participant.service';

@Injectable()
export class ParticipanteJwtStrategy extends PassportStrategy(
  Strategy,
  'participante',
) {
  constructor(private participantService: ParticipantService) {
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

  async validate(payload: any): Promise<Participante> {
    const participant = await this.participantService.findById(payload.sub);

    if (!participant) throw new UnauthorizedException('Invalid token');

    return participant;
  }
}
