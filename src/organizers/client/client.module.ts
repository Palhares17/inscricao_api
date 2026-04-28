import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClienteOrganizadores } from 'src/core/entities/cliente/cliente-organizadores.entity';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClienteOrganizadores]), AuthModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
