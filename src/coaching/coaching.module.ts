import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { Coachee } from '../coaching/models/coachee.model';
import { Coach } from './models/coach.model';
import { CoachApplication } from './models/coachApplication.model';
import { CoachingArea } from './models/coachingArea.model';
import { Document } from './models/document.model';
import { VideoSessionsModule } from '../videoSessions/videoSessions.module';
import { CoachNote } from './models/coachNote.model';
import { CoacheeEvaluation } from './models/coacheeEvaluation.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachResolver } from './resolvers/coach.resolver';
import { CoachService } from './services/coach.service';
import { CoachingAreaService } from './services/coachingArea.service';
import { CoacheeService } from './services/coachee.service';
import { CoacheesResolver } from './resolvers/coachee.resolver';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => VideoSessionsModule),
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
    CoacheeService,
    CoachService,
    CoachingAreaService,
  ],
})
export class CoachingModule {}
