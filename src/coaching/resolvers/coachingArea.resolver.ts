import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { CoachingAreaDto } from '../dto/coachingAreas.dto';
import { CoachingArea } from '../models/coachingArea.model';
import { CoachingAreaService } from '../services/coachingArea.service';

@Resolver(() => CoachingArea)
@UseGuards(JwtAuthGuard)
export class CoachingAreasesolver extends BaseResolver(CoachingArea, {
  create: CoachingAreaDto,
  update: CoachingAreaDto,
}) {
  constructor(protected readonly service: CoachingAreaService) {
    super();
  }
}
