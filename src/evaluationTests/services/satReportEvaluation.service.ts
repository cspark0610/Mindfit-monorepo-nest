import { Injectable } from '@nestjs/common';
import { filterAnswers, getMean } from '../common/functions/common';
import { SatResultAreaDto } from '../dto/satResult.dto';
import { BasicEvaluation } from '../interfaces/basicEvaluation.interface';
import { EmotionalStateEvaluationService } from './evaluation/emotionalStateEvaluation.service';
import { HappinessEvaluationService } from './evaluation/happinessEvaluation.service';
import { LeadershipEvaluationService } from './evaluation/leadershipEvaluation.service';
import { LifePurposeEvaluationService } from './evaluation/lifePurposeEvaluation.service';
import { SubordinateEvaluationService } from './evaluation/subordinateEvaluation.service';

@Injectable()
export class SatReportEvaluationService {
  constructor(
    private subordinateEvaluationService: SubordinateEvaluationService,
    private leadershipEvaluationService: LeadershipEvaluationService,
    private emotionalStateEvaluationService: EmotionalStateEvaluationService,
    private lifePurposeEvaluationService: LifePurposeEvaluationService,
    private happinessEvaluationService: HappinessEvaluationService,
  ) {}

  async getSatResult(satReportId: number): Promise<SatResultAreaDto[]> {
    return Promise.all([
      this.subordinateEvaluationService.getEvaluation(satReportId),
      this.leadershipEvaluationService.getEvaluation(satReportId),
      this.emotionalStateEvaluationService.getEvaluation(satReportId),
      this.lifePurposeEvaluationService.getEvaluation(satReportId),
      this.happinessEvaluationService.getEvaluation(satReportId),
    ]);
  }

  getBasicEvaluation(data: BasicEvaluation) {
    try {
      const answersSelected = filterAnswers(
        data.reportQuestions,
        data.questionDimension,
      );

      const mean = getMean(answersSelected);

      return {
        name: data.name,
        value: mean,
        base: data.base,
      };
    } catch (error) {
      console.error(error);
      return {
        name: '',
        value: 0,
        base: 0,
      };
    }
  }
}
