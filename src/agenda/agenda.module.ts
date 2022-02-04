import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { UsersModule } from 'src/users/users.module';
import { CoachAgenda } from './models/coachAgenda.model';
import { CoachAgendaDay } from './models/coachAgendaDay.model';
import { CoachAppointment } from './models/coachAppointment.model';
import { CoachAgendaResolver } from './resolvers/coachAgenda.resolver';
import { CoachAgendaDayResolver } from './resolvers/coachAgendaDay.resolver';
import { CoachAgendaService } from './services/coachAgenda.service';
import { CoachAgendaDayService } from './services/coachAgendaDay.service';
import { CoachAppointmentService } from './services/coachAppointment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoachAgenda, CoachAgendaDay, CoachAppointment]),
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    CoachAgendaService,
    CoachAgendaDayService,
    CoachAgendaResolver,
    CoachAgendaDayResolver,
    CoachAppointmentService,
  ],
  exports: [CoachAgendaService],
})
export class AgendaModule {}
