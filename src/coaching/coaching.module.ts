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

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => VideoSessionsModule),
    AwsModule,
    TypeOrmModule.forFeature([
      Coach,
      Coachee,
      CoachApplication,
      CoacheeEvaluation,
      CoachingArea,
      Document,
      CoachNote,
    ]),
  ],
  providers: [
    CoachResolver,
    CoacheesResolver,
    CoachingAreasesolver,
    CoacheeService,
    CoachService,
    CoachingAreaService,
  ],
})
export class CoachingModule {}
