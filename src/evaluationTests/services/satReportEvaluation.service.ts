import { Injectable } from '@nestjs/common';
import { SatResultAreaDto } from 'src/evaluationTests/dto/satResult.dto';
import { EmotionalStateEvaluationService } from 'src/evaluationTests/services/evaluation/emotionalStateEvaluation.service';
import { HappinessEvaluationService } from 'src/evaluationTests/services/evaluation/happinessEvaluation.service';
import { HealtEvaluationService } from 'src/evaluationTests/services/evaluation/healtEvaluation.service';
import { LeadershipEvaluationService } from 'src/evaluationTests/services/evaluation/leadershipEvaluation.service';
import { LifePurposeEvaluationService } from 'src/evaluationTests/services/evaluation/lifePurposeEvaluation.service';
import { SubordinateEvaluationService } from 'src/evaluationTests/services/evaluation/subordinateEvaluation.service';
import { TeamWorkEvaluationService } from 'src/evaluationTests/services/evaluation/teamworkEvaluation.service';

@Injectable()
export class SatReportEvaluationService {
  constructor(
    private subordinateEvaluationService: SubordinateEvaluationService,
    private leadershipEvaluationService: LeadershipEvaluationService,
    private emotionalStateEvaluationService: EmotionalStateEvaluationService,
    private lifePurposeEvaluationService: LifePurposeEvaluationService,
    private happinessEvaluationService: HappinessEvaluationService,
    private teamworkEvaluationService: TeamWorkEvaluationService,
    private healtEvaluationService: HealtEvaluationService,
  ) {}

  async getSatResult(satReportId: number): Promise<SatResultAreaDto[]> {
    return await Promise.all([
      this.subordinateEvaluationService.getEvaluation(satReportId),
      this.leadershipEvaluationService.getEvaluation(satReportId),
      this.emotionalStateEvaluationService.getEvaluation(satReportId),
      this.lifePurposeEvaluationService.getEvaluation(satReportId),
      this.happinessEvaluationService.getEvaluation(satReportId),
      this.teamworkEvaluationService.getEvaluation(satReportId),
      this.healtEvaluationService.getEvaluation(satReportId),
    ]);
  }
}
