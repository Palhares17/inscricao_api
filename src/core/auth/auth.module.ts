import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizadorJwtStrategy } from './strategies/organizador-jwt.strategy';
import { OrganizadorAuthGuard } from '../guards/organizador-auth.guard';
import { ClienteOrganizadores } from '../entities/cliente/cliente-organizadores.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClienteOrganizadores]),
    PassportModule.register({ defaultStrategy: 'organizador' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
      global: true,
    }),
  ],
  providers: [OrganizadorJwtStrategy, OrganizadorAuthGuard],
  exports: [OrganizadorAuthGuard, JwtModule, PassportModule],
})
export class AuthModule {}
