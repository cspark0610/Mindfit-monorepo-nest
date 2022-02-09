import { Injectable } from '@nestjs/common';
import { CoachNoteDto } from 'src/coaching/dto/coachNote.dto';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { CoachNoteRepository } from 'src/coaching/repositories/coachNote.repository';

@Injectable()
export class CoachNoteService {
  constructor(private coacheNoteRepository: CoachNoteRepository) {}

  async createCoachNote(coachNoteData: CoachNoteDto): Promise<CoachNote> {
    const data = await CoachNoteDto.from(coachNoteData);
    return this.coacheNoteRepository.create(data);
  }

  editCoachNote(id: number, coachNoteData: CoachNoteDto): Promise<CoachNote> {
    return this.coacheNoteRepository.update(id, coachNoteData);
  }

  editCoachNotes(
    ids: Array<number>,
    coachNoteData: CoachNoteDto,
  ): Promise<Array<CoachNote>> {
    return this.coacheNoteRepository.updateMany(ids, coachNoteData);
  }

  deleteCoachNotes(id: number | Array<number>): Promise<number> {
    return this.coacheNoteRepository.delete(id);
  }

  getCoachNote(id: number): Promise<CoachNote> {
    return this.coacheNoteRepository.findOneBy({ id });
  }

  getCoachNotes(where: Partial<CoachNote>): Promise<CoachNote[]> {
    return this.coacheNoteRepository.findAll(where);
  }
}
