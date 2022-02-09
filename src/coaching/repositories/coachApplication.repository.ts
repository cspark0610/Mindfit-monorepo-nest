import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';

@EntityRepository(CoachApplication)
export class CoachApplicationRepository extends BaseRepository<CoachApplication> {
  getQueryBuilder(): SelectQueryBuilder<CoachApplication> {
    return this.repository
      .createQueryBuilder('coachApplication')
      .leftJoinAndSelect('coachApplication.documents', 'documents')
      .leftJoinAndSelect('coachApplication.coach', 'coach');
  }
}
