import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachAgenda } from './models/coachAgenda.model';
import { CoachAgendaDay } from './models/coachAgendaDay.model';
import { CoachAppointment } from './models/coachAppointment.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoachAgenda, CoachAgendaDay, CoachAppointment]),
  ],
})
export class AgendaModule {}
