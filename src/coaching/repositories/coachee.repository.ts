import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Coachee } from 'src/coaching/models/coachee.model';

@EntityRepository(Coachee)
export class CoacheeRepository extends BaseRepository<Coachee> {
  getQueryBuilder(): SelectQueryBuilder<Coachee> {
    return this.repository
      .createQueryBuilder('coachee')
      .leftJoinAndSelect('coachee.user', 'user')
      .leftJoinAndSelect('coachee.organization', 'organization')
      .leftJoinAndSelect('coachee.assignedCoach', 'assignedCoach')
      .leftJoinAndSelect('coachee.suggestedCoaches', 'suggestedCoaches')
      .leftJoinAndSelect('coachee.coachingAreas', 'coachingAreas')
      .leftJoinAndSelect('coachee.coachAppointments', 'coachAppointments')
      .leftJoinAndSelect('coachee.coachNotes', 'coachNotes')
      .leftJoinAndSelect('coachee.coachingSessions', 'coachingSessions')
      .leftJoinAndSelect('coachee.coacheeEvaluations', 'coacheeEvaluations');
  }
}
