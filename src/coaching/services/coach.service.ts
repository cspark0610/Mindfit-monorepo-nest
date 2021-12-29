import { Injectable } from '@nestjs/common';
import { CoachDto, EditCoachDto } from '../dto/coach.dto';
import { Coach } from '../models/coach.model';

@Injectable()
export class CoachService {
  async createCoach(coachData: CoachDto): Promise<Coach> {
    return Coach.create({ ...coachData });
  }

  async editCoach(id: number, coachData: EditCoachDto): Promise<Coach> {
    return Coach.update({ ...coachData }, { where: { id } })[1];
  }

  async bulkEditCoachs(
    ids: Array<number>,
    coachData: EditCoachDto,
  ): Promise<[number, Coach[]]> {
    return Coach.update({ ...coachData }, { where: { id: ids } });
  }

  async deactivateCoach(id: number): Promise<Coach> {
    return Coach.update({ isActive: false }, { where: { id } })[1];
  }

  async deleteCoach(id: number): Promise<number> {
    return Coach.destroy({ where: { id } });
  }

  async bulkDeleteCoachs(ids: Array<number>): Promise<number> {
    return Coach.destroy({ where: { id: ids } });
  }

  async getCoach(id: number): Promise<Coach> {
    return Coach.findByPk(id);
  }

  async getCoachs(where: object): Promise<Coach[]> {
    return Coach.findAll({ where });
  }
}
