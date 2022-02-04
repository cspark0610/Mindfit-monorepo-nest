import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachNoteDto } from 'src/coaching/dto/coachNote.dto';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CoachNoteService {
  constructor(
    @InjectRepository(CoachNote)
    private coacheNoteRepository: Repository<CoachNote>,
  ) {}

  async createCoachNote(coachNoteData: CoachNoteDto): Promise<CoachNote> {
    const data = await CoachNoteDto.from(coachNoteData);
    return this.coacheNoteRepository.save(data);
  }

  async editCoachNotes(
    id: number | Array<number>,
    coachNoteData: CoachNoteDto,
  ): Promise<CoachNote | CoachNote[]> {
    const result = await this.coacheNoteRepository
      .createQueryBuilder()
      .update()
      .set({ ...coachNoteData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();

    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoachNotes(id: number | Array<number>): Promise<number> {
    const result = await this.coacheNoteRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();

    return result.affected;
  }

  async getCoachNote(id: number): Promise<CoachNote> {
    return this.coacheNoteRepository.findOne(id);
  }

  async getCoachNotes(where: FindManyOptions<CoachNote>): Promise<CoachNote[]> {
    return this.coacheNoteRepository.find(where);
  }
}
