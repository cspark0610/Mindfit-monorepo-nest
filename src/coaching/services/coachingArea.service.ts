import { Injectable } from '@nestjs/common';
import { CoachingAreaDto } from '../dto/coachingAreas.dto';
import { CoachingArea } from '../models/coachingArea.model';

@Injectable()
export class CoachingAreaService {
  async createCoachingArea(
    coachingAreaData: CoachingAreaDto,
  ): Promise<CoachingArea> {
    return CoachingArea.create({ ...coachingAreaData });
  }

  async editCoachingArea(
    id: number,
    coachingAreaData: CoachingAreaDto,
  ): Promise<CoachingArea> {
    return CoachingArea.update({ ...coachingAreaData }, { where: { id } })[1];
  }

  async bulkEditCoachingAreas(
    ids: Array<number>,
    coachingAreaData: CoachingAreaDto,
  ): Promise<[number, CoachingArea[]]> {
    return CoachingArea.update({ ...coachingAreaData }, { where: { id: ids } });
  }

  async deleteCoachingArea(id: number): Promise<number> {
    return CoachingArea.destroy({ where: { id } });
  }

  async bulkDeleteCoachingArea(ids: Array<number>): Promise<number> {
    return CoachingArea.destroy({ where: { id: ids } });
  }

  async getCoachingArea(id: number): Promise<CoachingArea> {
    return CoachingArea.findByPk(id);
  }

  async getCoachingAreas(where: object): Promise<CoachingArea[]> {
    return CoachingArea.findAll({ where });
  }
}
