import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { RegisterModule } from './register/register.module';
import { ExtrasModule } from './extras/extras.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [ClientModule, RegisterModule, ExtrasModule, EnrollmentsModule],
})
export class OrganizersModule {}
