import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { InscricaoModalidade } from 'src/core/entities/inscricao/inscricao-modalidade.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InscricaoModalidade, Evento]),
    AuthModule,
  ],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
