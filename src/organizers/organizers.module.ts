import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { ExtrasModule } from './extras/extras.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { CategoryModule } from './category/category.module';
import { CheckInModule } from './check-in/check-in.module';

@Module({
  imports: [ClientModule, CategoryModule, ExtrasModule, EnrollmentsModule, CheckInModule],
})
export class OrganizersModule {}
