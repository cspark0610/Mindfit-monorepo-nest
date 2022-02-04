import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { Repository } from 'typeorm';

@Injectable()
export class SatReportQuestionsService extends BaseService<SatReportQuestion> {
  constructor(
    @InjectRepository(SatReportQuestion)
    protected readonly repository: Repository<SatReportQuestion>,
  ) {
    super();
  }
}
