import { Injectable } from '@nestjs/common';
import { CoacheeEvaluationDto } from '../dto/coacheeEvaluation.dto';
import { CoacheeEvaluation } from '../models/coacheeEvaluation.model';

@Injectable()
export class CoacheeEvaluationService {
  async createCoacheeEvaluation(
    coacheeEvaluationAreaData: CoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    return CoacheeEvaluation.create({ ...coacheeEvaluationAreaData });
  }

  async editCoacheeEvaluation(
    id: number,
    coacheeEvaluationAreaData: CoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    return CoacheeEvaluation.update(
      { ...coacheeEvaluationAreaData },
      { where: { id } },
    )[1];
  }

  async bulkEditCoacheeEvaluations(
    ids: Array<number>,
    coacheeEvaluationAreaData: CoacheeEvaluationDto,
  ): Promise<[number, CoacheeEvaluation[]]> {
    return CoacheeEvaluation.update(
      { ...coacheeEvaluationAreaData },
      { where: { id: ids } },
    );
  }

  async deleteCoacheeEvaluation(id: number): Promise<number> {
    return CoacheeEvaluation.destroy({ where: { id } });
  }

  async bulkDeleteCoacheeEvaluation(ids: Array<number>): Promise<number> {
    return CoacheeEvaluation.destroy({ where: { id: ids } });
  }

  async getCoacheeEvaluation(id: number): Promise<CoacheeEvaluation> {
    return CoacheeEvaluation.findByPk(id);
  }

  async getCoacheeEvaluations(where: object): Promise<CoacheeEvaluation[]> {
    return CoacheeEvaluation.findAll({ where });
  }
}
