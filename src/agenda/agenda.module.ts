import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachAgenda } from './models/coachAgenda.model';
import { CoachAgendaDay } from './models/coachAgendaDay.model';
import { CoachAppointment } from './models/coachAppointment.model';
import { CoachAgendaResolver } from './resolvers/coachAgenda.resolver';
import { CoachAgendaService } from './services/coachAgenda.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoachAgenda, CoachAgendaDay, CoachAppointment]),
  ],
  providers: [CoachAgendaService, CoachAgendaResolver],
  exports: [CoachAgendaService],
})
export class AgendaModule {}
