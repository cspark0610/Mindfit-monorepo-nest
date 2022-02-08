import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { Repository } from 'typeorm';

@Injectable()
export class CoachingSessionService extends BaseService<CoachingSession> {
  constructor(
    @InjectRepository(CoachingSession)
    protected readonly repository: Repository<CoachingSession>,
  ) {
    super();
  }
}
