import { Injectable } from '@nestjs/common';
import { SatResultAreaDto } from 'src/evaluationTests/dto/satResult.dto';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatSectionResultsService } from '../satSectionResult.service';
import { BaseEvaluationService } from './baseEvaluation.service';

@Injectable()
export class HealtEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaDto> {
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
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.DIET,
        base: 6,
        name: 'Alimentación',
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.REST_AND_SLEEP,
        base: 6,
        name: 'Descanso y Sueño',
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.MENTAL_RELAXATION,
        base: 6,
        name: 'Relajación Mental',
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.PERSONAL_AND_PROFESIONAL_BALANCE,
        base: 6,
        name: 'Equilibrio Pesonal y Profesional',
      }),
    ];

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
    };
  }
}
