import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OrganizadorJwtStrategy } from './strategies/organizador-jwt.strategy';
import { OrganizadorGuard } from '../guards/organizador.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'organizador' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
      global: true,
    }),
  ],
  providers: [OrganizadorJwtStrategy, OrganizadorGuard],
  exports: [OrganizadorGuard, JwtModule, PassportModule],
})
export class AuthModule {}
