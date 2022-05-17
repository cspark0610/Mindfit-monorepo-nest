import { Injectable } from '@nestjs/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { DiagnosticsEnum } from 'src/evaluationTests/enums/diagnostics.enum';
import { BasicEvaluationResult } from 'src/evaluationTests/interfaces/basicEvalutationResult.interface';

@Injectable()
export class EmotionalStateEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation({
        satReportId,
        codeName: SectionCodenames.EMOTIONAL_STATE,
      });

    const evaluationResult = [
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.JOY,
        base: 10,
        name: 'Alegría',
        codename: QuestionDimentions.JOY,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.ANGER,
        base: 10,
        name: 'Ira-Hostilidad',
        codename: QuestionDimentions.ANGER,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.ANXIETY,
        base: 10,
        name: 'Ansiedad',
        codename: QuestionDimentions.ANXIETY,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.SADNESS,
        base: 10,
        name: 'Tristeza - Depresión',
        codename: QuestionDimentions.SADNESS,
      }),
    ];

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
      diagnostics: this.getDiagnostics(evaluationResult),
    };
  }

  getDiagnostics(
    evaluationResults: BasicEvaluationResult[],
  ): DiagnosticsEnum[] {
    const { value: joyValue } = evaluationResults.find(
      (item) => item.codename === QuestionDimentions.JOY,
    );
    const { value: angerValue } = evaluationResults.find(
      (item) => item.codename === QuestionDimentions.ANGER,
    );
    const { value: anxietyValue } = evaluationResults.find(
      (item) => item.codename === QuestionDimentions.ANXIETY,
    );
    const { value: sadnessValue } = evaluationResults.find(
      (item) => item.codename === QuestionDimentions.SADNESS,
    );

    return [
      ...this.getJoyDiagnostics(joyValue),
      ...this.getAngerDiagnostics(angerValue),
      ...this.getAxietyDiagnostics(anxietyValue),
      ...this.getSadnessDiagnostics(sadnessValue),
    ];
  }

  getJoyDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 8) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_JOY_STATE);
    }
    if (value > 6 && value <= 8) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_JOY_STATE);
    }
    if (value <= 6) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_JOY_STATE);
    }

    return diagnostics;
  }
  getAngerDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 6) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_ANGER_STATE);
    }
    if (value <= 6 && value > 2) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_ANGER_STATE);
    }
    if (value <= 2) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_ANGER_STATE);
    }

    return diagnostics;
  }
  getAxietyDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 6) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_ANXIETY_STATE);
    }
    if (value <= 6 && value > 3) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_ANXIETY_STATE);
    }
    if (value <= 3) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_ANXIETY_STATE);
    }

    return diagnostics;
  }
  getSadnessDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 6) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_SADNESS_STATE);
    }
    if (value <= 6 && value > 2) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_SADNESS_STATE);
    }
    if (value <= 2) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_SADNESS_STATE);
    }

    return diagnostics;
  }
}
