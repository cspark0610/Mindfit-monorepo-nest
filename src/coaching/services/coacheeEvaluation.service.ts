import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateCoacheeEvaluationDto,
  UpdateCoacheeEvaluationDto,
} from 'src/coaching/dto/coacheeEvaluation.dto';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoacheeEvaluationRepository } from 'src/coaching/repositories/coacheeEvaluation.repository';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { UsersService } from 'src/users/services/users.service';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';

@Injectable()
export class CoacheeEvaluationService extends BaseService<CoacheeEvaluation> {
  constructor(
    protected repository: CoacheeEvaluationRepository,
    private userService: UsersService,
    private coacheeService: CoacheeService,
  ) {
    super();
  }

  async coachCreateCoacheeEvaluation(
    userId: number,
    data: CreateCoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    const user = await this.userService.findOne({
      id: userId,
      relations: {
        ref: 'user',
        relations: [['user.coach', 'coach']],
      },
    });

    if (!user.coach) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }

    // get from repository do not return relations
    const coachee = await this.coacheeService.findOne({
      id: data.coacheeId,
      relations: {
        ref: 'coachee',
        relations: [['coachee.assignedCoach', 'assignedCoach']],
      },
    });

    if (coachee?.assignedCoach?.id != user.coach.id) {
      throw new MindfitException({
        error: 'The coachee is not assigned to you.',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoacheeErrors.COACHEE_NOT_ASSIGNED_TO_COACH,
      });
    }

    //Exclude coacheeId from data, and queried coachee is used
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { coacheeId, ...rest } = data;

    return this.repository.create({
      coach: user.coach,
      coachee,
      ...rest,
    });
  }

  async coachUpdateCoacheeEvaluation(
    userId: number,
    evaluationId: number,
    data: UpdateCoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    const user = await this.userService.findOne({
      id: userId,
      relations: {
        ref: 'user',
        relations: [['user.coach', 'coach']],
      },
    });

    if (!user.coach) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }

    const coacheeEvaluation = await this.findOne({
      id: evaluationId,
      relations: {
        ref: 'coacheeEvaluation',
        relations: [
          ['coacheeEvaluation.coach', 'coach'],
          ['coacheeEvaluation.coachee', 'coachee'],
          ['coachee.assignedCoach', 'assignedCoach'],
        ],
      },
    });

    if (coacheeEvaluation.coach.id != user.coach.id) {
      throw new MindfitException({
        error: 'The Coachee Evaluation does not belong to you.',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoacheeErrors.NOT_COACHEE_EVALUATION_OWNER,
      });
    }

    if (coacheeEvaluation.coachee?.assignedCoach?.id != user.coach.id) {
      throw new MindfitException({
        error: 'The coachee is no longer assigned to you.',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoacheeErrors.COACHEE_NOT_ASSIGNED_TO_COACH,
      });
    }

    return this.update(evaluationId, data);
  }

  async coachDeleteCoacheeEvaluation(userId: number, evaluationId: number) {
    const user = await this.userService.findOne({
      id: userId,
      relations: {
        ref: 'user',
        relations: [['user.coach', 'coach']],
      },
    });

    if (!user.coach) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }

    const coacheeEvaluation = await this.findOne({
      id: evaluationId,
      relations: {
        ref: 'coacheeEvaluation',
        relations: [
          ['coacheeEvaluation.coach', 'coach'],
          ['coacheeEvaluation.coachee', 'coachee'],
          ['coachee.assignedCoach', 'assignedCoach'],
        ],
      },
    });

    if (coacheeEvaluation.coach.id != user.coach.id) {
      throw new MindfitException({
        error: 'The Coachee Evaluation does not belong to you.',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoacheeErrors.NOT_COACHEE_EVALUATION_OWNER,
      });
    }

    if (coacheeEvaluation.coachee?.assignedCoach?.id != user.coach.id) {
      throw new MindfitException({
        error: 'The coachee is no longer assigned to you.',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoacheeErrors.COACHEE_NOT_ASSIGNED_TO_COACH,
      });
    }

    return this.delete(evaluationId);
  }
}
