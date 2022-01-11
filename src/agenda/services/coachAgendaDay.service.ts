import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CoachAgendaDayDto } from '../dto/coachAgendaDay.dto';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';

@Injectable()
export class coachAgendaDayService {
  constructor(
    @InjectRepository(CoachAgendaDay)
    private coachAgendaDayRepository: Repository<CoachAgendaDay>,
  ) {}

  async createCoachAgendaDay(
    coachAgendaDayData: CoachAgendaDayDto,
  ): Promise<CoachAgendaDay> {
    const data = await CoachAgendaDayDto.from(coachAgendaDayData);

    return this.coachAgendaDayRepository.save(data);
  }

  async editCoachAgendaDays(
    id: number | Array<number>,
    coachAgendaDayData: CoachAgendaDayDto,
  ): Promise<CoachAgendaDay> {
    const result = await this.coachAgendaDayRepository
      .createQueryBuilder()
      .update()
      .set({ ...coachAgendaDayData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();

    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoachAgendaDays(id: number | Array<number>): Promise<number> {
    const result = await this.coachAgendaDayRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();

    return result.affected;
  }

  async getCoachAgendaDay(id: number): Promise<CoachAgendaDay> {
    return this.coachAgendaDayRepository.findOne(id);
  }

  async getCoachAgendaDays(
    where: FindManyOptions<CoachAgendaDay>,
  ): Promise<CoachAgendaDay[]> {
    return this.coachAgendaDayRepository.find(where);
  }
}
