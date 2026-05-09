import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Inscricao } from 'src/core/entities/inscricao/inscricao.entity';
import { Evento } from 'src/core/entities/evento/evento.entity';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inscricao, Evento]), AuthModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
