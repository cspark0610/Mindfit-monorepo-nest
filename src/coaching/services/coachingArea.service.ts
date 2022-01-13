import { Injectable } from '@nestjs/common';
import { CoachingAreaDto } from '../dto/coachingAreas.dto';
import { CoachingArea } from '../models/coachingArea.model';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CoachingAreaService {
  constructor(
    @InjectRepository(CoachingArea)
    private coachingAreasRepository: Repository<CoachingArea>,
  ) {}
  async createCoachingArea(
    coachingAreaData: CoachingAreaDto,
  ): Promise<CoachingArea> {
    return this.coachingAreasRepository.save(coachingAreaData);
  }

  async editCoachingArea(
    id: number | Array<number>,
    coachingAreaData: CoachingAreaDto,
  ): Promise<CoachingArea> {
    const result = await this.coachingAreasRepository
      .createQueryBuilder()
      .update()
      .set({ ...coachingAreaData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();

    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoachingAreas(id: number | Array<number>): Promise<number> {
    const result = await this.coachingAreasRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }

  async getCoachingArea(id: number): Promise<CoachingArea> {
    return this.coachingAreasRepository.findOne(id);
  }

  async getCoachingAreas(
    where?: FindManyOptions<CoachingArea>,
  ): Promise<CoachingArea[]> {
    return this.coachingAreasRepository.find(where);
  }
}
