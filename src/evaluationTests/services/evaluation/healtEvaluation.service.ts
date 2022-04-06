import { Injectable } from '@nestjs/common';
import { DiagnosticsEnum } from 'src/evaluationTests/enums/diagnostics.enum';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';

import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { BasicEvaluationResult } from 'src/evaluationTests/interfaces/basicEvalutationResult.interface';

import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';

@Injectable()
export class HealtEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.HEALT,
      );

    const evaluationResult = [
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.PHYSICAL_ACTIVITY,
        base: 6,
        name: 'Actividad Física',
        codename: QuestionDimentions.PHYSICAL_ACTIVITY,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.DIET,
        base: 6,
        name: 'Alimentación',
        codename: QuestionDimentions.DIET,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.REST_AND_SLEEP,
        base: 6,
        name: 'Descanso y Sueño',
        codename: QuestionDimentions.REST_AND_SLEEP,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.MENTAL_RELAXATION,
        base: 6,
        name: 'Relajación Mental',
        codename: QuestionDimentions.MENTAL_RELAXATION,
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.PERSONAL_AND_PROFESIONAL_BALANCE,
        base: 6,
        name: 'Equilibrio Pesonal y Profesional',
        codename: QuestionDimentions.PERSONAL_AND_PROFESIONAL_BALANCE,
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
    const { value: PyshicalActivityValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.PHYSICAL_ACTIVITY,
    );
    const { value: DietValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.DIET,
    );
    const { value: restValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.REST_AND_SLEEP,
    );
    const { value: MentalValue } = evaluationResults.find(
      (item) => item.codename == QuestionDimentions.MENTAL_RELAXATION,
    );
    const { value: balanceValue } = evaluationResults.find(
      (item) =>
        item.codename == QuestionDimentions.PERSONAL_AND_PROFESIONAL_BALANCE,
    );

    return [
      ...this.getAreaDiagnostics(PyshicalActivityValue, 'pyshical'),
      ...this.getAreaDiagnostics(DietValue, 'diet'),
      ...this.getAreaDiagnostics(MentalValue, 'mental'),
      ...this.getAreaDiagnostics(restValue, 'rest'),
      ...this.getAreaDiagnostics(balanceValue, 'balance'),
    ];
  }

  getAreaDiagnostics(value: number, areaName: string): DiagnosticsEnum[] {
    const diagnostics: DiagnosticsEnum[] = [];

    const areasAndEnums = {
      pyshical: {
        high: DiagnosticsEnum.ABOVE_AVERAGE_PHYSICAL_ACTIVITY,
        low: DiagnosticsEnum.LOW_AVERAGE_PHYSICAL_ACTIVITY,
      },
      diet: {
        high: DiagnosticsEnum.ABOVE_AVERAGE_DIET,
        low: DiagnosticsEnum.LOW_AVERAGE_DIET,
      },
      mental: {
        high: DiagnosticsEnum.ABOVE_AVERAGE_MENTAL_RELAXATION,
        low: DiagnosticsEnum.LOW_AVERAGE_MENTAL_RELAXATION,
      },
      rest: {
        high: DiagnosticsEnum.ABOVE_AVERAGE_REST_AND_SLEEP,
        low: DiagnosticsEnum.LOW_AVERAGE_REST_AND_SLEEP,
      },
      balance: {
        high: DiagnosticsEnum.ABOVE_AVERAGE_PERSONAL_AND_PROFESIONAL_BALANCE,
        low: DiagnosticsEnum.LOW_AVERAGE_PERSONAL_AND_PROFESIONAL_BALANCE,
      },
    };

    if (value > 5) {
      diagnostics.push(areasAndEnums[areaName]['high']);
    }
    if (value <= 5) {
      diagnostics.push(areasAndEnums[areaName]['low']);
    }

    return diagnostics;
  }
}
