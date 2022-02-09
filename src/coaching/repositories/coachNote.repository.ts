import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachNote } from 'src/coaching/models/coachNote.model';

@EntityRepository(CoachNote)
export class CoachNoteRepository extends BaseRepository<CoachNote> {
  getQueryBuilder(): SelectQueryBuilder<CoachNote> {
    return this.repository
      .createQueryBuilder('coachNote')
      .leftJoinAndSelect('coachNote.coach', 'coach')
      .leftJoinAndSelect('coachNote.coachee', 'coachee');
  }
}
