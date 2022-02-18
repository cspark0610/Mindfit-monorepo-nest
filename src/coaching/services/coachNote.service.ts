import { Injectable } from '@nestjs/common';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { CoachNoteRepository } from 'src/coaching/repositories/coachNote.repository';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class CoachNoteService extends BaseService<CoachNote> {
  constructor(protected repository: CoachNoteRepository) {
    super();
  }
}
