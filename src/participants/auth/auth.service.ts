import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ParticipantService } from '../participant/participant.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from 'src/core/modules/crypto/crypto.service';
import { SignUpDto } from './dto/sign-up.dto';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { SignInDTO } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private participantService: ParticipantService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
  ) {}
  async signUp(body: SignUpDto) {
    const emailCriptografado = this.cryptoService.criptografaMaoDupla(
      body.email.toLowerCase(),
    );

    const participant =
      await this.participantService.findByEmail(emailCriptografado);

    if (participant) {
      throw new BadRequestException(
        'Já existe um participante cadastrado com este email.',
      );
    }

    const newParticipantDto = new CreateParticipantDto({
      nome: this.cryptoService.criptografaMaoDupla(body.nome),
      email: emailCriptografado,
      senha: this.cryptoService.criptografaMaoUnica(body.senha),
    });

    await this.participantService.create(newParticipantDto);

    return await this.singIn({
      email: body.email,
      senha: body.senha,
    });
  }

  async singIn(body: SignInDTO) {
    const emailCriptografado = this.cryptoService.criptografaMaoDupla(
      body.email.toLowerCase(),
    );
    const senhaCriptografada = this.cryptoService.criptografaMaoUnica(
      body.senha,
    );

    const participante =
      await this.participantService.findByEmail(emailCriptografado);

    if (
      !participante ||
      !participante.dados ||
      participante.dados?.senha !== senhaCriptografada
    ) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: participante.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '3d' }),
    };
  }

  refreshToken(oldRefreshToken: string) {
    const decoded = this.jwtService.decode(oldRefreshToken) as {
      sub: string;
    };

    if (!decoded) {
      throw new UnauthorizedException('Token de refresh inválido.');
    }

    this.validateRefreshToken(oldRefreshToken);

    const newPayload = {
      sub: decoded.sub,
    };

    return {
      access_token: this.jwtService.sign(newPayload, { expiresIn: '1d' }),
      refresh_token: this.jwtService.sign(newPayload, { expiresIn: '3d' }),
    };
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      return payload;
    } catch (error) {
      throw new UnauthorizedException(
        'Token de refresh inválido ou expirado. Faça login novamente.',
      );
    }
  }
}
