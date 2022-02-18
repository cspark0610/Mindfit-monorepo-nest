import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Feedback } from 'src/videoSessions/models/feedback.model';
import { FeedbackRepository } from 'src/videoSessions/repositories/feedback.repository';

@Injectable()
export class FeedbackService extends BaseService<Feedback> {
  constructor(protected readonly repository: FeedbackRepository) {
    super();
  }
}
