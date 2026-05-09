import { Module } from '@nestjs/common';
import { EventosModule } from './events/eventos.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [EventosModule, EnrollmentsModule],
})
export class ParticipantsModule {}
