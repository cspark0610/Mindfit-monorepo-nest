import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoachDto, EditCoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachService } from 'src/coaching/services/coach.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';

@Resolver(() => Coach)
@UseGuards(JwtAuthGuard)
export class CoachResolver extends BaseResolver(Coach, {
  create: CoachDto,
  update: EditCoachDto,
}) {
  constructor(protected readonly service: CoachService) {
    super();
  }
}
