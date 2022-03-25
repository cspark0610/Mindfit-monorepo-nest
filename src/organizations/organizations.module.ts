import { forwardRef, Module } from '@nestjs/common';
import { OrganizationsResolver } from 'src/organizations/resolvers/organizations.resolver';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationRepository } from 'src/organizations/repositories/organization.repository';
import { UsersModule } from 'src/users/users.module';
import { EvaluationTestsModule } from 'src/evaluationTests/evaluationTests.module';
import { VideoSessionsModule } from 'src/videoSessions/videoSessions.module';
import { AwsModule } from 'src/aws/aws.module';
import { CoachingModule } from 'src/coaching/coaching.module';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoacheesResolver } from 'src/coaching/resolvers/coachee.resolver';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { HistoricalAssigmentRepository } from 'src/coaching/repositories/historicalAssigment.repository';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { SuggestedCoachesRepository } from 'src/coaching/repositories/suggestedCoaches.repository';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoreConfigRepository } from 'src/config/repositories/config.repository';
import { CoachAgendaRepository } from 'src/agenda/repositories/coachAgenda.repository';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';
import { CoachAgendaDayRepository } from 'src/agenda/repositories/coachAgendaDay.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationRepository,
      CoacheeRepository,
      HistoricalAssigmentRepository,
      CoachRepository,
      SuggestedCoachesRepository,
      CoachAppointmentRepository,
      CoreConfigRepository,
      CoachAgendaRepository,
      CoachAgendaDayRepository,
    ]),
    UsersModule,
    forwardRef(() => EvaluationTestsModule),
    forwardRef(() => VideoSessionsModule),
    AwsModule,
    forwardRef(() => CoachingModule),
  ],
  providers: [
    OrganizationsResolver,
    OrganizationsService,
    CoacheesResolver,
    CoacheeService,
    HistoricalAssigmentService,
    SuggestedCoachesService,
    CoachAppointmentService,
    CoreConfigService,
    CoachAppointmentValidator,
    CoachAgendaService,
    CoachAgendaDayService,
    CoachAgendaDayValidator,
  ],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
