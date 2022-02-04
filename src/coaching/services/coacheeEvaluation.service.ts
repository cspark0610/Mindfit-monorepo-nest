import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoacheeEvaluationDto } from 'src/coaching/dto/coacheeEvaluation.dto';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CoacheeEvaluationService {
  constructor(
    @InjectRepository(CoacheeEvaluation)
    private coacheeEvaluationRepository: Repository<CoacheeEvaluation>,
  ) {}

  async createCoacheeEvaluation(
    coacheeEvaluationData: CoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    const data = await CoacheeEvaluationDto.from(coacheeEvaluationData);
    return this.coacheeEvaluationRepository.save(data);
  }
  async editCoacheesEvaluations(
    id: number | Array<number>,
    coacheeEvaluationData: CoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation | CoacheeEvaluation[]> {
    const result = await this.coacheeEvaluationRepository
      .createQueryBuilder()
      .update()
      .set({ ...coacheeEvaluationData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();
    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoacheesEvaluations(id: number | Array<number>): Promise<number> {
    const result = await this.coacheeEvaluationRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }

  async getCoacheeEvaluation(id: number): Promise<CoacheeEvaluation> {
    return this.coacheeEvaluationRepository.findOne(id);
  }

  async getCoacheeEvaluations(
    where: FindManyOptions<CoacheeEvaluation>,
  ): Promise<CoacheeEvaluation[]> {
    return this.coacheeEvaluationRepository.find(where);
  }
}
