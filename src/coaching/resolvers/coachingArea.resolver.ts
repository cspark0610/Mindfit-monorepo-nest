import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CoachingAreaDto } from 'src/coaching/dto/coachingAreas.dto';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { QueryRelations } from 'src/common/decorators/queryRelations.decorator';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

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
  async findAll(
    @QueryRelations('coachingArea') relations: QueryRelationsType,
  ): Promise<CoachingArea[]> {
    return this.service.findAll({ relations });
  }

  @Query(() => CoachingArea, { name: `findCoachingAreaById` })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @QueryRelations('coachingArea') relations: QueryRelationsType,
  ): Promise<CoachingArea> {
    return this.service.findOne({ id, relations });
  }
}
