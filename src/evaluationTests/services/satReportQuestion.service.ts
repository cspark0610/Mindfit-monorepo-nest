import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatReportQuestion } from '../models/satReportQuestion.model';

@Injectable()
export class SatReportQuestionsService extends BaseService<SatReportQuestion> {
  constructor(
    @InjectRepository(SatReportQuestion)
    protected readonly repository: Repository<SatReportQuestion>,
  ) {
    super();
  }
}
