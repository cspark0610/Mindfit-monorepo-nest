import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoachingAreaDto } from 'src/coaching/dto/coachingAreas.dto';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';

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
