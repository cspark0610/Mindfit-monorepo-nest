import { Injectable } from '@nestjs/common';
import { SatResultAreaDto } from 'src/evaluationTests/dto/satResult.dto';
import { QuestionDimentions } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatSectionResultsService } from '../satSectionResult.service';
import { BaseEvaluationService } from './baseEvaluation.service';

@Injectable()
export class LifePurposeEvaluationService extends BaseEvaluationService {
  constructor(private satSectionResultsService: SatSectionResultsService) {
    super();
  }

  async getEvaluation(satReportId: number): Promise<SatResultAreaDto> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.LEADERSHIP,
      );

    const evaluationResult = [
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.PERCEPTION_OF_LIFE,
        base: 5,
        name: 'Percepción de Sentido de Vida',
      }),
      this.getBasicEvaluation({
        reportQuestions: sectionResult.questions,
        questionDimension: QuestionDimentions.EXPERIENCE_OF_LIFE,
        base: 5,
        name: 'Vivencia de Sentido de Vida',
      }),
    ];

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: evaluationResult,
    };
  }
}
