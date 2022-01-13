import { Injectable } from '@nestjs/common';
import { CoachDto, EditCoachDto } from '../dto/coach.dto';
import { Coach } from '../models/coach.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CoachService {
  constructor(
    @InjectRepository(Coach)
    private coachsRepository: Repository<Coach>,
  ) {}

  async createCoach(coachData: CoachDto): Promise<Coach> {
    const data = await CoachDto.from(coachData);
    return this.coachsRepository.save(data);
  }

  async editCoachs(
    id: number | Array<number>,
    coachData: EditCoachDto,
  ): Promise<Coach | Coach[]> {
    const result = await this.coachsRepository
      .createQueryBuilder()
      .update()
      .set({ ...coachData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();
    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async getCoach(id: number): Promise<Coach> {
    return this.coachsRepository.findOne(id);
  }
  async getCoachs(where?: FindManyOptions<Coach>): Promise<Coach[]> {
    return this.coachsRepository.find(where);
  }

  async deleteCoachs(id: number | number[]): Promise<number> {
    const result = await this.coachsRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }
}
