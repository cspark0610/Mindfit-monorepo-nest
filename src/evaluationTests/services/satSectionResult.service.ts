import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { Repository } from 'typeorm';

@Injectable()
export class SatSectionResultsService extends BaseService<SatSectionResult> {
  constructor(
    @InjectRepository(SatSectionResult)
    protected readonly repository: Repository<SatSectionResult>,
  ) {
    super();
  }

  async getSectionResultsForEvaluation(
    satReportId: number,
    codeName: SectionCodenames,
  ): Promise<SatSectionResult> {
    return this.repository
      .createQueryBuilder('sectionResult')
      .leftJoin('sectionResult.satReport', 'satReport')
      .leftJoinAndSelect('sectionResult.section', 'section')
      .leftJoinAndSelect('sectionResult.questions', 'questions')
      .leftJoinAndSelect('questions.answersSelected', 'answersSelected')
      .leftJoinAndSelect('questions.question', 'question')
      .where('satReport.id = :satReportId', { satReportId })
      .andWhere('section.codename = :codeName', { codeName })
      .getOne();
  }
}
