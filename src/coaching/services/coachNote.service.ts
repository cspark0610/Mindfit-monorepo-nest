import { Injectable } from '@nestjs/common';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { CoachNoteRepository } from 'src/coaching/repositories/coachNote.repository';
import { BaseService } from 'src/common/service/base.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachNoteDto } from 'src/coaching/dto/coachNote.dto';

@Injectable()
export class CoachNoteService extends BaseService<CoachNote> {
  constructor(protected repository: CoachNoteRepository) {
    super();
  }

  async createCoachNoteWithCoachAndCocheeRelation(
    data: Partial<CoachNoteDto>,
    coach: Coach,
    coachee: Coachee,
  ): Promise<CoachNote> {
    const coachNote = await this.repository.create(data);
    if (coachNote && coach && coachee) {
      await Promise.all([
        this.repository.relationCoachNoteWithCoach(coachNote, coach),
        this.repository.relationCoachNoteWithCoachee(coachNote, coachee),
      ]);
      return coachNote;
    }
  }
}
