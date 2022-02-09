import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionRepository } from 'src/videoSessions/repositories/coachingSession.repository';

@Injectable()
export class CoachingSessionService extends BaseService<CoachingSession> {
  constructor(protected readonly repository: CoachingSessionRepository) {
    super();
  }
}
