import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgoraModule } from 'src/agora/agora.module';
import { CoachingModule } from 'src/coaching/coaching.module';
import { UsersModule } from 'src/users/users.module';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionRepository } from 'src/videoSessions/repositories/coachingSession.repository';
import { CoachingSessionResolver } from 'src/videoSessions/resolvers/coachingSession.resolver';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';

@Module({
  imports: [
    AgoraModule,
    forwardRef(() => UsersModule),
    forwardRef(() => CoachingModule),
    TypeOrmModule.forFeature([CoachingSession, CoachingSessionRepository]),
  ],
  providers: [CoachingSessionResolver, CoachingSessionService],
  exports: [CoachingSessionService],
})
export class VideoSessionsModule {}
