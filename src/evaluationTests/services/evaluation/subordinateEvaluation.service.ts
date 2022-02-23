import { Injectable } from '@nestjs/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { DiagnosticsEnum } from 'src/evaluationTests/enums/diagnostics.enum';
import { getAverage } from 'src/evaluationTests/common/functions/common';

@Injectable()
export class SubordinateEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.SUBORDINATE,
      );

    const evaluationResult = [
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.DOWNWARD_COMMUNICATION,
        base: 5,
        name: 'Comunicacion Ascendente',
        codename: QuestionDimentions.DOWNWARD_COMMUNICATION,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.UPWARD_COMMUNICATION,
        base: 5,
        name: 'Comunicacion Descendente',
        codename: QuestionDimentions.UPWARD_COMMUNICATION,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.HORIZONTAL_COMMUNICATION,
        base: 5,
        name: 'Comunicacion Horizontal',
        codename: QuestionDimentions.HORIZONTAL_COMMUNICATION,
      }),
    ];
    const evaluationResultValues = evaluationResult.map(
      (evaluation) => evaluation.value,
    );

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
      diagnostics: this.getDiagnostics(evaluationResultValues),
    };
  }

  getDiagnostics(values: number[]): DiagnosticsEnum[] {
    return [
      ...this.getCommunicationSkillDiagnostic(values),
      ...this.getCommunicationAreasDiagnostics(values),
    ];
  }

  getCommunicationSkillDiagnostic(values: number[]): DiagnosticsEnum[] {
    const average = getAverage(values);
    const diagnostics: DiagnosticsEnum[] = [];

    if (average > 4) {
      diagnostics.push(DiagnosticsEnum.OUTSTANGIND_COMMUNICATION);
    }
    if (average <= 4 && average > 3) {
      diagnostics.push(DiagnosticsEnum.BELOW_AVEGARE_COMMUNICATION);
    }
    if (average <= 3) {
      diagnostics.push(DiagnosticsEnum.LOW_SKILL_COMMUNICATION);
    }
    return diagnostics;
  }

  getCommunicationAreasDiagnostics(values: number[]): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (values.some((value) => value < 3)) {
      diagnostics.push(DiagnosticsEnum.LOW_AVERAGE_OF_SOME_COMMUNICATION_SKILL);
    }
    if (values.some((value) => value >= 3)) {
      diagnostics.push(DiagnosticsEnum.IN_AVERAGE_OF_SOME_COMMUNICATION_SKILL);
    }
    return diagnostics;
  }
}
