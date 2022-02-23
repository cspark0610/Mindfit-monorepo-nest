import { Injectable } from '@nestjs/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { BasicEvaluationResult } from 'src/evaluationTests/interfaces/basicEvalutationResult.interface';
import { DiagnosticsEnum } from 'src/evaluationTests/enums/diagnostics.enum';

@Injectable()
export class LifePurposeEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.LIFE_PURPOSE,
      );

    const evaluationResult = [
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.PERCEPTION_OF_LIFE,
        base: 6,
        name: 'Percepción de Sentido de Vida',
        codename: QuestionDimentions.PERCEPTION_OF_LIFE,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.EXPERIENCE_OF_LIFE,
        base: 6,
        name: 'Vivencia de Sentido de Vida',
        codename: QuestionDimentions.EXPERIENCE_OF_LIFE,
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
    const { value: perceptionValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.PERCEPTION_OF_LIFE,
    );
    const { value: experienceValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.EXPERIENCE_OF_LIFE,
    );

    return [
      ...this.getPercentionDiagnostics(perceptionValue),
      ...this.getExperienceDiagnostics(experienceValue),
    ];
  }

  getPercentionDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 6) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_PERCEPTION_OF_LIFE);
    }
    if (value >= 4 && value <= 6) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_PERCEPTION_OF_LIFE);
    }
    if (value < 4) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_PERCEPTION_OF_LIFE);
    }

    return diagnostics;
  }
  getExperienceDiagnostics(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 5) {
      diagnostics.push(DiagnosticsEnum.ABOVE_AVERAGE_EXPERIENCE_OF_LIFE);
    }
    if (value <= 5 && value > 3) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_EXPERIENCE_OF_LIFE);
    }
    if (value <= 3) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_EXPERIENCE_OF_LIFE);
    }

    return diagnostics;
  }
}
