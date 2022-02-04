import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { Repository } from 'typeorm';

@Injectable()
export class SatBasicQuestionsService extends BaseService<SatBasicQuestion> {
  constructor(
    @InjectRepository(SatBasicQuestion)
    protected readonly repository: Repository<SatBasicQuestion>,
  ) {
    super();
  }
}
