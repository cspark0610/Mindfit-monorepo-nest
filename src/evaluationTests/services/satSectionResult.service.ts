import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { SatSectionResultRepository } from 'src/evaluationTests/repositories/satSectionResult.repository';

@Injectable()
export class SatSectionResultsService extends BaseService<SatSectionResult> {
  constructor(protected readonly repository: SatSectionResultRepository) {
    super();
  }

  async getSectionResultsForEvaluation({
    satReportId,
    codeName,
    relations,
  }: {
    satReportId: number;
    codeName: SectionCodenames;
    relations?: QueryRelationsType;
  }): Promise<SatSectionResult> {
    return this.repository
      .getQueryBuilder(relations)
      .leftJoinAndSelect('questions.answersSelected', 'answersSelected')
      .leftJoinAndSelect('questions.question', 'question')
      .where('satReport.id = :satReportId', { satReportId })
      .andWhere('section.codename = :codeName', { codeName })
      .getOne();
  }
}
