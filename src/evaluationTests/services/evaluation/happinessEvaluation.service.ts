import { Injectable } from '@nestjs/common';
import { getMean } from 'src/evaluationTests/common/functions/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { SatResultPuntuationObjectType } from 'src/evaluationTests/models/satResultPuntuation.model';

@Injectable()
export class HappinessEvaluationService extends BaseEvaluationService {
  constructor(
    private satBasicAnswersService: SatBasicAnswersService,
    private satSectionResultsService: SatSectionResultsService,
  ) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.HAPPINESS,
      );

    const evaluationResult = await Promise.all([
      this.getPositiveEvaluation(sectionResult.questions),
      this.getNegativeEvaluation(sectionResult.questions),
    ]);

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
    };
  }

  async getPositiveEvaluation(
    reportQuestions: SatReportQuestion[],
  ): Promise<SatResultPuntuationObjectType> {
    const positiveAnswers =
      await this.satBasicAnswersService.getPositiveAnswers(
        reportQuestions.map((question) => question.id),
      );
    const mean = getMean(positiveAnswers);

    return {
      name: 'Felicidad y emociones positivas',
      value: mean,
      base: 5,
    };
  }

  async getNegativeEvaluation(
    reportQuestions: SatReportQuestion[],
  ): Promise<SatResultPuntuationObjectType> {
    const negativeAnswers =
      await this.satBasicAnswersService.getNegativeAnswers(
        reportQuestions.map((question) => question.id),
      );

    const mean = getMean(negativeAnswers);

    return {
      name: 'Felicidad y emociones negativas',
      value: mean,
      base: 5,
    };
  }
}
