import { Module } from '@nestjs/common';
import { EventosModule } from './events/eventos.module';

@Module({
  imports: [EventosModule],
})
export class ParticipantsModule {}
