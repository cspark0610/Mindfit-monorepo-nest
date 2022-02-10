import { Injectable } from '@nestjs/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';

@Injectable()
export class LeadershipEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.LEADERSHIP,
      );

    const evaluationResult = [
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.TRANSFORMATIONAL_LEADERSHIP,
        base: 5,
        name: 'Liderazgo Transformacional',
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.TRANSACTIONAL_LEADERSHIP,
        base: 5,
        name: 'Liderazgo Transaccional',
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.CORRECTIVE_AVOIDANT_LEADERSHIP,
        base: 5,
        name: 'Liderazgo Correctivo',
      }),
    ];

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
    };
  }
}
