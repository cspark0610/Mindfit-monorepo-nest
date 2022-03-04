import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';

@EntityRepository(CoacheeEvaluation)
export class CoacheeEvaluationRepository extends BaseRepository<CoacheeEvaluation> {
  getQueryBuilder(): SelectQueryBuilder<CoacheeEvaluation> {
    return this.repository
      .createQueryBuilder('coacheeEvaluation')
      .leftJoinAndSelect('coacheeEvaluation.coach', 'coach')
      .leftJoinAndSelect('coacheeEvaluation.coachee', 'coachee')
      .leftJoinAndSelect('coachee.assignedCoach', 'coacheeAssignedCoach');
  }
}
