import { Injectable } from '@nestjs/common';
import { CoacheeDto, EditCoacheeDto } from '../dto/coachee.dto';
import { Coachee } from '../models/coachee.model';

@Injectable()
export class CoacheeService {
  async createCoachee(coacheeData: CoacheeDto): Promise<Coachee> {
    return Coachee.create({ ...coacheeData });
  }

  async editCoachee(id: number, coacheeData: EditCoacheeDto): Promise<Coachee> {
    return Coachee.update({ ...coacheeData }, { where: { id } })[1];
  }

  async bulkEditCoachees(
    ids: Array<number>,
    coacheeData: EditCoacheeDto,
  ): Promise<[number, Coachee[]]> {
    return Coachee.update({ ...coacheeData }, { where: { id: ids } });
  }

  async deleteCoachee(id: number): Promise<number> {
    return Coachee.destroy({ where: { id } });
  }

  async bulkDeleteCoachees(ids: Array<number>): Promise<number> {
    return Coachee.destroy({ where: { id: ids } });
  }

  async getCoachee(id: number): Promise<Coachee> {
    return Coachee.findByPk(id);
  }

  async getCoachees(where: object): Promise<Coachee[]> {
    return Coachee.findAll({ where });
  }
}
