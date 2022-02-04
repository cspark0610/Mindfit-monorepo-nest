import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoachAgenda, CoachAgendaDay, CoachAppointment]),
  ],
})
export class AgendaModule {}
