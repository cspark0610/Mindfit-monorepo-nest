import { Injectable } from '@nestjs/common';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoacheeEvaluationRepository } from 'src/coaching/repositories/coacheeEvaluation.repository';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class CoacheeEvaluationService extends BaseService<CoacheeEvaluation> {
  constructor(protected repository: CoacheeEvaluationRepository) {
    super();
  }
}
