import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatBasicAnswer } from '../models/satBasicAnswer.model';

@Injectable()
export class SatBasicAnswersService extends BaseService<SatBasicAnswer> {
  constructor(
    @InjectRepository(SatBasicAnswer)
    protected readonly repository: Repository<SatBasicAnswer>,
  ) {
    super();
  }

  async getPositiveAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.repository
      .createQueryBuilder('selectedAnswers')
      .leftJoin('selectedAnswers.reportQuestions', 'reportQuestions')
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('selectedAnswers.value >=4')
      .getMany();
  }

  async getNegativeAnswers(ids: number[]): Promise<SatBasicAnswer[]> {
    return this.repository
      .createQueryBuilder('selectedAnswers')
      .leftJoin('selectedAnswers.reportQuestions', 'reportQuestions')
      .where('reportQuestions.id IN (:...ids)', { ids })
      .andWhere('selectedAnswers.value < 4')
      .getMany();
  }
}
