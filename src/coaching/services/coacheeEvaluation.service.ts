import { Injectable } from '@nestjs/common';
import { CoacheeEvaluationDto } from 'src/coaching/dto/coacheeEvaluation.dto';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoacheeEvaluationRepository } from 'src/coaching/repositories/coacheeEvaluation.repository';

@Injectable()
export class CoacheeEvaluationService {
  constructor(
    private coacheeEvaluationRepository: CoacheeEvaluationRepository,
  ) {}

  async createCoacheeEvaluation(
    coacheeEvaluationData: CoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    const data = await CoacheeEvaluationDto.from(coacheeEvaluationData);
    return this.coacheeEvaluationRepository.create(data);
  }

  editCoacheeEvaluation(
    id: number,
    coacheeEvaluationData: CoacheeEvaluationDto,
  ): Promise<CoacheeEvaluation> {
    return this.coacheeEvaluationRepository.update(id, coacheeEvaluationData);
  }

  editCoacheesEvaluations(
    ids: Array<number>,
    coacheeEvaluationData: CoacheeEvaluationDto,
  ): Promise<Array<CoacheeEvaluation>> {
    return this.coacheeEvaluationRepository.updateMany(
      ids,
      coacheeEvaluationData,
    );
  }

  deleteCoacheesEvaluations(id: number | Array<number>): Promise<number> {
    return this.coacheeEvaluationRepository.delete(id);
  }

  getCoacheeEvaluation(id: number): Promise<CoacheeEvaluation> {
    return this.coacheeEvaluationRepository.findOneBy({ id });
  }

  getCoacheeEvaluations(
    where: Partial<CoacheeEvaluation>,
  ): Promise<CoacheeEvaluation[]> {
    return this.coacheeEvaluationRepository.findAll(where);
  }
}
