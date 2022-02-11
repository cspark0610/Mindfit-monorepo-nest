import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { ConfigModule } from 'src/config/config.module';
import { UsersModule } from 'src/users/users.module';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';
import { CoachAgendaResolver } from 'src/agenda/resolvers/coachAgenda.resolver';
import { CoachAgendaDayResolver } from 'src/agenda/resolvers/coachAgendaDay.resolver';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoachAppointmentsResolver } from 'src/agenda/resolvers/coachAppointment.resolver';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { VideoSessionsModule } from 'src/videoSessions/videoSessions.module';
import { CoachAgendaRepository } from 'src/agenda/repositories/coachAgenda.repository';
import { CoachAgendaDayRepository } from 'src/agenda/repositories/coachAgendaDay.repository';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { CoachingModule } from 'src/coaching/coaching.module';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoachAgenda,
      CoachAgendaDay,
      CoachAppointment,
      CoachAgendaRepository,
      CoachAgendaDayRepository,
      CoachAppointmentRepository,
    ]),
    forwardRef(() => UsersModule),
    ConfigModule,
    VideoSessionsModule,
    CoachingModule,
  ],
  providers: [
    CoachAgendaService,
    CoachAgendaDayService,
    CoachAgendaResolver,
    CoachAgendaDayResolver,
    CoachAppointmentService,
    CoachAppointmentsResolver,
    CoachAppointmentValidator,
    CoachAgendaDayValidator,
  ],
  exports: [CoachAgendaService],
})
export class AgendaModule {}
