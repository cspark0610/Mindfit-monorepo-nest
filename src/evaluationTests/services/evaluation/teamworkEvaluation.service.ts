import { Injectable } from '@nestjs/common';
import { getMean } from 'src/evaluationTests/common/functions/common';
import {
  SatResultAreaDto,
  SatResultPuntuationDto,
} from 'src/evaluationTests/dto/satResult.dto';
import { AnswerDimensions } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatBasicAnswersService } from '../satBasicAnswer.service';
import { SatSectionResultsService } from '../satSectionResult.service';
import { BaseEvaluationService } from './baseEvaluation.service';

@Injectable()
export class TeamWorkEvaluationService extends BaseEvaluationService {
  constructor(
    private satBasicAnswersService: SatBasicAnswersService,
    private satSectionResultsService: SatSectionResultsService,
  ) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaDto> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.TEAMWORK,
      );

    const evaluationResult = await Promise.all([
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.CW),
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.CH),
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.ME),
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.PL),
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.RI),
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.TW),
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.CF),
      this.getDimensionEvaluation(sectionResult.questions, AnswerDimensions.SH),
    ]);

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
    };
  }

  async getDimensionEvaluation(
    reportQuestions: SatReportQuestion[],
    dimension: AnswerDimensions,
  ): Promise<SatResultPuntuationDto> {
    const dimensionAnswers =
      await this.satBasicAnswersService.getDimensionAnswers(
        reportQuestions.map((question) => question.id),
        dimension,
      );

    const mean = dimensionAnswers.length > 0 ? getMean(dimensionAnswers) : 0;

    return {
      name: `${dimension}`,
      value: mean,
      base: 20,
    };
  }
}
