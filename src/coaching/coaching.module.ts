import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { Coachee } from '../coaching/models/coachee.model';
import { Coach } from './models/coach.model';
import { CoachApplication } from './models/coachApplication.model';
import { CoachingAreas } from './models/coachingAreas.model';
import { Document } from './models/document.model';
import { VideoSessionsModule } from 'src/videoSessions/videoSessions.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => VideoSessionsModule),
    SequelizeModule.forFeature([
      Coach,
      Coachee,
      CoachApplication,
      CoachingAreas,
      Document,
    ]),
  ],
  providers: [],
})
export class CoachingModule {}
