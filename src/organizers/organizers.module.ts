import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [ClientModule, RegisterModule],
})
export class OrganizersModule {}
