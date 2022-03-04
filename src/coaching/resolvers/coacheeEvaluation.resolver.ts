import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import {
  CreateCoacheeEvaluationDto,
  UpdateCoacheeEvaluationDto,
} from 'src/coaching/dto/coacheeEvaluation.dto';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoacheeEvaluationService } from 'src/coaching/services/coacheeEvaluation.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';

@UseGuards(JwtAuthGuard)
@Resolver(() => CoacheeEvaluation)
export class CoacheeEvaluationResolver extends BaseResolver(CoacheeEvaluation, {
  create: CreateCoacheeEvaluationDto,
  update: UpdateCoacheeEvaluationDto,
}) {
  constructor(protected readonly service: CoacheeEvaluationService) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoacheeEvaluation, { name: `createCoacheeEvaluation` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateCoacheeEvaluationDto })
    data: CreateCoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    return this.service.coachCreateCoacheeEvaluation(session.userId, data);
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoacheeEvaluation, { name: `updateCoacheeEvaluation` })
  async update(
    @Args('coacheeEvaluationId', { type: () => Int })
    coacheeEvaluationId: number,
    @Args('data', { type: () => UpdateCoacheeEvaluationDto })
    data: UpdateCoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    return this.service.update(coacheeEvaluationId, data);
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => Int, { name: `deleteCoacheeEvaluation` })
  async delete(
    @Args('coacheeEvaluationId', { type: () => Int })
    coacheeEvaluationId: number,
  ) {
    return this.service.delete(coacheeEvaluationId);
  }
}
