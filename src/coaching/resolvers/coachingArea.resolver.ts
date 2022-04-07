import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoachingAreaDto } from 'src/coaching/dto/coachingAreas.dto';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';

@Resolver(() => CoachingArea)
@UseGuards(JwtAuthGuard)
export class CoachingAreaResolver extends BaseResolver(CoachingArea, {
  create: CoachingAreaDto,
  update: CoachingAreaDto,
}) {
  constructor(protected readonly service: CoachingAreaService) {
    super();
  }

  @Query(() => [CoachingArea], { name: `findAllCoachingAreas` })
  async findAll(): Promise<CoachingArea[]> {
    return this.service.findAll();
  }

  @Query(() => CoachingArea, { name: `findCoachingAreaById` })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<CoachingArea> {
    return this.service.findOne(id);
  }
}
