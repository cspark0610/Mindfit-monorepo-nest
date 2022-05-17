import { Injectable } from '@nestjs/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { DiagnosticsEnum } from 'src/evaluationTests/enums/diagnostics.enum';
import { BasicEvaluationResult } from 'src/evaluationTests/interfaces/basicEvalutationResult.interface';

@Injectable()
export class LeadershipEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation({
        satReportId,
        codeName: SectionCodenames.LEADERSHIP,
      });

    const evaluationResult = [
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.TRANSFORMATIONAL_LEADERSHIP,
        base: 5,
        name: 'Liderazgo Transformacional',
        codename: QuestionDimentions.TRANSFORMATIONAL_LEADERSHIP,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.TRANSACTIONAL_LEADERSHIP,
        base: 5,
        name: 'Liderazgo Transaccional',
        codename: QuestionDimentions.TRANSACTIONAL_LEADERSHIP,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.CORRECTIVE_AVOIDANT_LEADERSHIP,
        base: 5,
        name: 'Liderazgo Correctivo',
        codename: QuestionDimentions.CORRECTIVE_AVOIDANT_LEADERSHIP,
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
    const { value: transformationalValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.TRANSFORMATIONAL_LEADERSHIP,
    );
    const { value: transactionalValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.TRANSACTIONAL_LEADERSHIP,
    );
    const { value: correctiveValue } = evaluationResults.find(
      (item) =>
        item.codename == QuestionDimentions.CORRECTIVE_AVOIDANT_LEADERSHIP,
    );

    return [
      ...this.getTransformationalLeadershipDiagnostic(transformationalValue),
      ...this.getTransactionalLeadershipDiagnostic(transactionalValue),
      ...this.getCorrectiveLeadershipDiagnostic(correctiveValue),
    ];
  }

  getTransformationalLeadershipDiagnostic(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 4) {
      diagnostics.push(DiagnosticsEnum.HIGH_TRANSFORMATIONAL_LEADERSHIP);
    }
    if (value <= 4) {
      diagnostics.push(DiagnosticsEnum.SOME_TRANSFORMATIONAL_LEADERSHIP);
    }

    return diagnostics;
  }
  getTransactionalLeadershipDiagnostic(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 4) {
      diagnostics.push(DiagnosticsEnum.HIGH_TRANSACTIONAL_LEADERSHIP);
    }
    if (value <= 4) {
      diagnostics.push(DiagnosticsEnum.SOME_TRANSACTIONAL_LEADERSHIP);
    }

    return diagnostics;
  }
  getCorrectiveLeadershipDiagnostic(value: number): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    if (value > 4) {
      diagnostics.push(DiagnosticsEnum.HIGH_CORRECTIVE_LEADERSHIP);
    }
    if (value <= 4) {
      diagnostics.push(DiagnosticsEnum.SOME_CORRECTIVE_LEADERSHIP);
    }

    return diagnostics;
  }
}
