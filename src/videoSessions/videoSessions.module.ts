import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaModule } from 'src/agenda/agenda.module';
import { AgoraModule } from 'src/agora/agora.module';
import { CoachingModule } from 'src/coaching/coaching.module';
import { UsersModule } from 'src/users/users.module';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { Feedback } from 'src/videoSessions/models/feedback.model';
import { CoachingSessionRepository } from 'src/videoSessions/repositories/coachingSession.repository';
import { CoachingSessionFeedbackRepository } from 'src/videoSessions/repositories/coachingSessionFeedback.repository';
import { FeedbackRepository } from 'src/videoSessions/repositories/feedback.repository';
import { CoachingSessionResolver } from 'src/videoSessions/resolvers/coachingSession.resolver';
import { CoachingSessionFeedbackResolver } from 'src/videoSessions/resolvers/coachingSessionFeedback.resolver';
import { FeedbackResolver } from 'src/videoSessions/resolvers/feedback.resolver';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { CoachingSessionFeedbackService } from 'src/videoSessions/services/coachingSessionFeedback.service';
import { FeedbackService } from 'src/videoSessions/services/feedback.service';

@Module({
  imports: [
    AgoraModule,
    forwardRef(() => UsersModule),
    forwardRef(() => CoachingModule),
    forwardRef(() => AgendaModule),
    TypeOrmModule.forFeature([
      CoachingSession,
      Feedback,
      CoachingSessionFeedback,
      CoachingSessionRepository,
      FeedbackRepository,
      CoachingSessionFeedbackRepository,
    ]),
  ],
  providers: [
    CoachingSessionResolver,
    CoachingSessionService,
    FeedbackService,
    CoachingSessionFeedbackService,
    FeedbackResolver,
    CoachingSessionFeedbackResolver,
  ],
  exports: [CoachingSessionService, CoachingSessionFeedbackService],
})
export class VideoSessionsModule {}
