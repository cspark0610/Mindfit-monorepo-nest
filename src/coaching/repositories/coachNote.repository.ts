import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachNote)
export class CoachNoteRepository extends BaseRepository<CoachNote> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'coachNote', relations: [] },
  ): SelectQueryBuilder<CoachNote> {
    return super.getQueryBuilder(relations);
  }
}
