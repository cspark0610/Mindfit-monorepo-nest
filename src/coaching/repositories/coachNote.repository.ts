import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';

@EntityRepository(CoachNote)
export class CoachNoteRepository extends BaseRepository<CoachNote> {
  getQueryBuilder(): SelectQueryBuilder<CoachNote> {
    return this.repository
      .createQueryBuilder('coachNote')
      .leftJoinAndSelect('coachNote.coach', 'coach')
      .leftJoinAndSelect('coachNote.coachee', 'coachee');
  }

  relationCoachNoteWithCoach(
    coachNote: CoachNote,
    coach: Coach,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(CoachNote, 'coach')
      .of(coachNote)
      .set(coach);
    // as its a many-to-one relation
  }

  relationCoachNoteWithCoachee(
    coachNote: CoachNote,
    coachee: Coachee,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(CoachNote, 'coach')
      .of(coachNote)
      .set(coachee);
  }
}
