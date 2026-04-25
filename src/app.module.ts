import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { dataSourceOptions } from './core/database/data-source';
import { ParticipantsModule } from './participants/participants.module';
import { OrganizersModule } from './organizers/organizers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ParticipantsModule,
    OrganizersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
