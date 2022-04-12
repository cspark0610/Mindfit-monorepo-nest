import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUpdateCoacheeObjectiveDto } from 'src/coaching/dto/coacheeObjetive.dto';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { CoacheeObjectiveRepository } from 'src/coaching/repositories/coacheeObjective.repository';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';

@Injectable()
export class CoacheeObjectiveService extends BaseService<CoacheeObjective> {
  constructor(
    protected readonly repository: CoacheeObjectiveRepository,
    private coacheeService: CoacheeService,
  ) {
    super();
  }

  async validateCoacheeObjectiveOwnership(
    coachee: Coachee,
    coacheeObjectiveId: number,
    coacheeObjective?: CoacheeObjective,
  ) {
    coacheeObjective
      ? coacheeObjective
      : (coacheeObjective = await this.findOne(coacheeObjectiveId));

    if (coacheeObjective.coachee.id !== coachee.id) {
      throw new MindfitException({
        error: `The Objective does not belong to you`,
        errorCode: CoacheeErrors.NOT_OBJECTIVE_OWNER,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async createByCoachee(
    userId: number,
    data: CreateUpdateCoacheeObjectiveDto,
  ): Promise<CoacheeObjective> {
    const coachee = await this.coacheeService.validateActiveCoacheeProfile(
      userId,
    );

    return this.create({ coachee: coachee, ...data });
  }

  async updateByCoachee(
    userId: number,
    coacheeObjectiveId: number,
    data: CreateUpdateCoacheeObjectiveDto,
  ): Promise<CoacheeObjective> {
    const coachee = await this.coacheeService.validateActiveCoacheeProfile(
      userId,
    );

    await this.validateCoacheeObjectiveOwnership(coachee, coacheeObjectiveId);

    return this.update(coacheeObjectiveId, data);
  }

  async deleteByCoachee(
    userId: number,
    coacheeObjectiveId: number,
  ): Promise<number> {
    const coachee = await this.coacheeService.validateActiveCoacheeProfile(
      userId,
    );

    await this.validateCoacheeObjectiveOwnership(coachee, coacheeObjectiveId);

    return this.delete(coacheeObjectiveId);
  }
}
