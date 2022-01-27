import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SectionCodenames } from '../models/satBasicSection.model';
import { SatSectionResult } from '../models/satSectionResult.model';

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
      .leftJoinAndSelect('questions.answers', 'answers')
      .where('satReport = :satReportId', { satReportId })
      .andWhere('section.codename = :codeName', { codeName })
      .getOne();
  }
}
