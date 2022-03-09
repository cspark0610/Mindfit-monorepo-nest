import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CreateUpdateCoacheeObjectiveDto } from 'src/coaching/dto/coacheeObjetive.dto';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { CoacheeObjectiveService } from 'src/coaching/services/coacheeObjective.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';

@Resolver(() => CoacheeObjective)
@UseGuards(JwtAuthGuard)
export class CoacheeObjectiveResolver extends BaseResolver(CoacheeObjective, {
  create: CreateUpdateCoacheeObjectiveDto,
  update: CreateUpdateCoacheeObjectiveDto,
}) {
  constructor(protected readonly service: CoacheeObjectiveService) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => CoacheeObjective, { name: `createCoacheeObjective` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateUpdateCoacheeObjectiveDto })
    data: CreateUpdateCoacheeObjectiveDto,
  ): Promise<CoacheeObjective> {
    return this.service.createByCoachee(session.userId, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => CoacheeObjective, { name: `updateCoacheeObjective` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Int }) id: number,
    @Args('data', { type: () => CreateUpdateCoacheeObjectiveDto })
    data: CreateUpdateCoacheeObjectiveDto,
  ): Promise<CoacheeObjective> {
    return this.service.updateByCoachee(session.userId, id, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Int, { name: `deleteCoacheeObjective` })
  async delete(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<number> {
    return this.service.deleteteByCoachee(session.userId, id);
  }
}
