import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { SatSectionResultRepository } from 'src/evaluationTests/repositories/satSectionResult.repository';

@Injectable()
export class SatSectionResultsService extends BaseService<SatSectionResult> {
  constructor(protected readonly repository: SatSectionResultRepository) {
    super();
  }

  async getSectionResultsForEvaluation(
    satReportId: number,
    codeName: SectionCodenames,
  ): Promise<SatSectionResult> {
    return this.repository
      .getQueryBuilder()
      .leftJoinAndSelect('questions.answersSelected', 'answersSelected')
      .leftJoinAndSelect('questions.question', 'question')
      .where('satReport.id = :satReportId', { satReportId })
      .andWhere('section.codename = :codeName', { codeName })
      .getOne();
  }
}
