import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ParticipantModule } from '../participant/participant.module';
import { CryptoModule } from 'src/core/modules/crypto/crypto.module';

@Module({
  imports: [ParticipantModule, CryptoModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
