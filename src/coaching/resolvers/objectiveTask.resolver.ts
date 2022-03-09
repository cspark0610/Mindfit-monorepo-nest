import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import {
  CreateObjectiveTaskDto,
  UpdateObjectiveTaskDto,
} from 'src/coaching/dto/objetiveTask.dto';
import { ObjectiveTask } from 'src/coaching/models/objetiveTask.model';
import { ObjectiveTaskService } from 'src/coaching/services/objectiveTask.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';

@Resolver(() => ObjectiveTask)
@UseGuards(JwtAuthGuard)
export class ObjectiveTaskResolver extends BaseResolver(ObjectiveTask, {
  create: CreateObjectiveTaskDto,
  update: UpdateObjectiveTaskDto,
}) {
  constructor(protected readonly service: ObjectiveTaskService) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => ObjectiveTask, { name: `createObjectiveTask` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateObjectiveTaskDto })
    data: CreateObjectiveTaskDto,
  ): Promise<ObjectiveTask> {
    return this.service.createByCoachee(session.userId, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => ObjectiveTask, { name: `updateObjectiveTask` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Int }) id: number,
    @Args('data', { type: () => UpdateObjectiveTaskDto })
    data: UpdateObjectiveTaskDto,
  ): Promise<ObjectiveTask> {
    return this.service.updateByCoachee(session.userId, id, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Int, { name: `deleteObjectiveTask` })
  async delete(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<number> {
    return this.service.deleteByCoachee(session.userId, id);
  }
}
