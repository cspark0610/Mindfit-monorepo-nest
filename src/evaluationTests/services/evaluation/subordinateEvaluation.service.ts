import { Injectable } from '@nestjs/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';

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
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.UPWARD_COMMUNICATION,
        base: 5,
        name: 'Comunicacion Descendente',
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.HORIZONTAL_COMMUNICATION,
        base: 5,
        name: 'Comunicacion Horizontal',
      }),
    ];

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
    };
  }
}
