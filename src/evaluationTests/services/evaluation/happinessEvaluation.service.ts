import { Injectable } from '@nestjs/common';
import { getAnswersMeanValue } from 'src/evaluationTests/common/functions/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { DiagnosticsEnum } from 'src/evaluationTests/enums/diagnostics.enum';
import { BasicEvaluationResult } from 'src/evaluationTests/interfaces/basicEvalutationResult.interface';

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
      diagnostics: this.getDiagnostics(evaluationResult),
    };
  }

  async getPositiveEvaluation(
    reportQuestions: SatReportQuestion[],
  ): Promise<BasicEvaluationResult> {
    const positiveAnswers =
      await this.satBasicAnswersService.getPositiveAnswers(
        reportQuestions.map((question) => question.id),
      );
    const mean = getAnswersMeanValue(positiveAnswers);

    return {
      name: 'Felicidad y emociones positivas',
      value: mean,
      base: 5,
    };
  }

  async getNegativeEvaluation(
    reportQuestions: SatReportQuestion[],
  ): Promise<BasicEvaluationResult> {
    const negativeAnswers =
      await this.satBasicAnswersService.getNegativeAnswers(
        reportQuestions.map((question) => question.id),
      );

    const mean = getAnswersMeanValue(negativeAnswers);

    return {
      name: 'Felicidad y emociones negativas',
      value: mean,
      base: 5,
    };
  }

  getDiagnostics(
    evaluationResults: BasicEvaluationResult[],
  ): DiagnosticsEnum[] {
    const { value: positiveEmotionsValue } = evaluationResults.find(
      (item) => item.name == 'Felicidad y emociones positivas',
    );
    const { value: negativeEmotionsValue } = evaluationResults.find(
      (item) => item.name == 'Felicidad y emociones negativas',
    );

    return [
      ...this.getPositiveEmotionsDiagnostics(positiveEmotionsValue),
      ...this.getNegativeEmotionsDiagnostics(negativeEmotionsValue),
    ];
  }

  getPositiveEmotionsDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 4.5) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_POSITIVE_EMOTIONS);
    }
    if (value > 3 && value <= 4.5) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_POSITIVE_EMOTIONS);
    }
    if (value <= 3) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_POSITIVE_EMOTIONS);
    }

    return diagnostics;
  }
  getNegativeEmotionsDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 4.5) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_NEGATIVE_EMOTIONS);
    }
    if (value > 3 && value <= 4.5) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_NEGATIVE_EMOTIONS);
    }
    if (value <= 3) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_NEGATIVE_EMOTIONS);
    }

    return diagnostics;
  }
}
