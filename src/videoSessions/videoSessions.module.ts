import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachingModule } from 'src/coaching/coaching.module';
import { UsersModule } from 'src/users/users.module';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionRepository } from 'src/videoSessions/repositories/coachingSession.repository';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CoachingModule),
    TypeOrmModule.forFeature([CoachingSession, CoachingSessionRepository]),
  ],
  providers: [CoachingSessionService],
  exports: [CoachingSessionService],
})
export class VideoSessionsModule {}
