import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoachAgenda } from './models/coachAgenda.model';
import { CoachAgendaDay } from './models/coachAgendaDay.model';
import { CoachAppointment } from './models/coachAppointment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CoachAgenda, CoachAgendaDay, CoachAppointment]),
  ],
})
export class AgendaModule {}
