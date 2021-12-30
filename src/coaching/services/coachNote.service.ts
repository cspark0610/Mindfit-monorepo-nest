import { Injectable } from '@nestjs/common';
import { CoachNoteDto } from '../dto/coachNote.model';
import { CoachNote } from '../models/coachNote.model';

@Injectable()
export class CoachNoteService {
  async createCoachNote(coachNoteData: CoachNoteDto): Promise<CoachNote> {
    return CoachNote.create({ ...coachNoteData });
  }

  async editCoachNote(
    id: number,
    coachNoteData: CoachNoteDto,
  ): Promise<CoachNote> {
    return CoachNote.update({ ...coachNoteData }, { where: { id } })[1];
  }

  async bulkEditCoachNotes(
    ids: Array<number>,
    coachNoteData: CoachNoteDto,
  ): Promise<[number, CoachNote[]]> {
    return CoachNote.update({ ...coachNoteData }, { where: { id: ids } });
  }

  async deleteCoachNote(id: number): Promise<number> {
    return CoachNote.destroy({ where: { id } });
  }

  async bulkDeleteCoachNotes(ids: Array<number>): Promise<number> {
    return CoachNote.destroy({ where: { id: ids } });
  }

  async getCoachNote(id: number): Promise<CoachNote> {
    return CoachNote.findByPk(id);
  }

  async getCoachNotes(where: object): Promise<CoachNote[]> {
    return CoachNote.findAll({ where });
  }
}
