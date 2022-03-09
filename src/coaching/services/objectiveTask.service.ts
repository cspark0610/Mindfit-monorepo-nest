import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateObjectiveTaskDto,
  UpdateObjectiveTaskDto,
} from 'src/coaching/dto/objetiveTask.dto';
import { ObjectiveTaskErrors } from 'src/coaching/enums/objectiveTaskErrors.enum';
import { Coachee } from 'src/coaching/models/coachee.model';
import { ObjectiveTask } from 'src/coaching/models/objetiveTask.model';
import { ObjectiveTaskRepository } from 'src/coaching/repositories/objectiveTask.repository';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoacheeObjectiveService } from 'src/coaching/services/coacheeObjective.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class ObjectiveTaskService extends BaseService<ObjectiveTask> {
  constructor(
    protected readonly repository: ObjectiveTaskRepository,
    private coacheeObjectiveService: CoacheeObjectiveService,
    private coacheeService: CoacheeService,
  ) {
    super();
  }

  /**
   * Validate task executions against repetitions
   */
  async validateTaskUpdate(
    taskId: number,
    data: Partial<ObjectiveTask>,
    task?: ObjectiveTask,
  ) {
    task ? task : (task = await this.findOne(taskId));

    if (
      data?.executions &&
      data?.repetitions &&
      data?.executions > data?.repetitions
    ) {
      throw new MindfitException({
        error: `Executions must be less or equal to repetitions.`,
        errorCode: ObjectiveTaskErrors.EXECUTIONS_GREATER_THAN_REPETITIONS,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (!data?.repetitions && data?.executions > task.repetitions) {
      throw new MindfitException({
        error: `Executions must be less or equal to repetitions.`,
        errorCode: ObjectiveTaskErrors.EXECUTIONS_GREATER_THAN_REPETITIONS,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return task;
  }

  async validateTaskOwnership(
    coachee: Coachee,
    taskId: number,
    task?: ObjectiveTask,
  ) {
    task ? task : (task = await this.findOne(taskId));
    if (task.objective.coachee.id !== coachee.id) {
      throw new MindfitException({
        error: `The task does not belong to you`,
        errorCode: ObjectiveTaskErrors.NO_TASK_OWNER,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return task;
  }

  async update(
    id: number,
    data: Partial<ObjectiveTask>,
  ): Promise<ObjectiveTask> {
    await this.validateTaskUpdate(id, data);
    return super.update(id, data);
  }

  async createByCoachee(
    userId: number,
    data: CreateObjectiveTaskDto,
  ): Promise<ObjectiveTask> {
    const [, objective] = await Promise.all([
      this.coacheeService.validateActiveCoacheeProfile(userId),
      await this.coacheeObjectiveService.findOne(data.coacheeObjectiveId),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { coacheeObjectiveId, ...rest } = data;

    return this.create({ objective, ...rest });
  }

  async updateByCoachee(
    userId: number,
    id: number,
    data: UpdateObjectiveTaskDto,
  ): Promise<ObjectiveTask> {
    const [coachee, task] = await Promise.all([
      this.coacheeService.validateActiveCoacheeProfile(userId),
      await this.findOne(id),
    ]);

    await this.validateTaskOwnership(coachee, null, task);
    return this.update(id, data);
  }

  async deleteByCoachee(userId: number, id: number): Promise<number> {
    const coachee = await this.coacheeService.validateActiveCoacheeProfile(
      userId,
    );
    await this.validateTaskOwnership(coachee, id);
    return this.delete(id);
  }
}
