import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatBasicQuestion } from '../models/satBasicQuestion.model';

@Injectable()
export class SatBasicQuestionsService extends BaseService<SatBasicQuestion> {
  constructor(
    @InjectRepository(SatBasicQuestion)
    protected readonly repository: Repository<SatBasicQuestion>,
  ) {
    super();
  }
}
