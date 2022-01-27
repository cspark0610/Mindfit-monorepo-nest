import { Injectable } from '@nestjs/common';
import { getMean } from 'src/evaluationTests/common/functions/common';
import {
  SatResultAreaDto,
  SatResultPuntuationDto,
} from 'src/evaluationTests/dto/satResult.dto';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatBasicAnswersService } from '../satBasicAnswer.service';
import { SatSectionResultsService } from '../satSectionResult.service';
import { BaseEvaluationService } from './baseEvaluation.service';

@Injectable()
export class HappinessEvaluationService extends BaseEvaluationService {
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
  ): Promise<SatResultPuntuationDto> {
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
  ): Promise<SatResultPuntuationDto> {
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
