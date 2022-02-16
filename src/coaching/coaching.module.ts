import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { VideoSessionsModule } from 'src/videoSessions/videoSessions.module';
import { AwsModule } from 'src/aws/aws.module';
import { Coachee } from 'src/coaching/models/coachee.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { CoachResolver } from 'src/coaching/resolvers/coach.resolver';
import { CoacheesResolver } from 'src/coaching/resolvers/coachee.resolver';
import { CoachingAreasesolver } from 'src/coaching/resolvers/coachingArea.resolver';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoachService } from 'src/coaching/services/coach.service';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { Document } from 'src/coaching/models/document.model';
import { AgendaModule } from 'src/agenda/agenda.module';
import { CoachApplicationRepository } from 'src/coaching/repositories/coachApplication.repository';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { CoacheeEvaluationRepository } from 'src/coaching/repositories/coacheeEvaluation.repository';
import { CoachingAreaRepository } from 'src/coaching/repositories/coachingArea.repository';
import { CoachNoteRepository } from 'src/coaching/repositories/coachNote.repository';
import { SuggestedCoachesResolver } from 'src/coaching/resolvers/suggestedCoaches.resolver';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { SuggestedCoachesRepository } from 'src/coaching/repositories/suggestedCoaches.repository';
import { EvaluationTestsModule } from 'src/evaluationTests/evaluationTests.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => VideoSessionsModule),
    forwardRef(() => AgendaModule),
    forwardRef(() => EvaluationTestsModule),
    TypeOrmModule.forFeature([
      Coach,
      Coachee,
      CoachApplication,
      CoacheeEvaluation,
      CoachingArea,
      Document,
      CoachNote,
      CoachRepository,
      CoachApplicationRepository,
      CoacheeRepository,
      CoacheeEvaluationRepository,
      CoachingAreaRepository,
      CoachNoteRepository,
      SuggestedCoachesRepository,
    ]),
    AwsModule,
  ],
  providers: [
    CoachResolver,
    CoacheesResolver,
    CoachingAreasesolver,
    CoacheeService,
    CoachService,
    CoachingAreaService,
    SuggestedCoachesResolver,
    SuggestedCoachesService,
  ],
  exports: [CoacheeService, CoachService],
})
export class CoachingModule {}
