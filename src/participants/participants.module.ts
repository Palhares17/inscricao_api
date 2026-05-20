import { Module } from '@nestjs/common';
import { EventosModule } from './events/eventos.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AuthModule } from './auth/auth.module';
import { ParticipantModule } from './participant/participant.module';
import { ExtrasModule } from './extras/extras.module';

@Module({
  imports: [EventosModule, EnrollmentsModule, AuthModule, ParticipantModule, ExtrasModule],
})
export class ParticipantsModule {}
