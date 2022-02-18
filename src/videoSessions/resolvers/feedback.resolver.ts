import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { FeedbackDto } from 'src/videoSessions/dto/feedback.dto';
import { Feedback } from 'src/videoSessions/models/feedback.model';
import { FeedbackService } from 'src/videoSessions/services/feedback.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => Feedback)
export class FeedbackResolver extends BaseResolver(Feedback, {
  create: FeedbackDto,
  update: FeedbackDto,
}) {
  constructor(protected readonly service: FeedbackService) {
    super();
  }
}
