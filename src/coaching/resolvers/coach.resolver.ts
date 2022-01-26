import { Resolver } from '@nestjs/graphql';
import { CoachDto, EditCoachDto } from '../dto/coach.dto';
import { Coach } from '../models/coach.model';
import { CoachService } from '../services/coach.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
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
