import { Injectable } from '@nestjs/common';
import { Identifier } from 'sequelize/types';
import { CoacheeDto, EditCoacheeDto } from '../dto/coachee.dto';
import { Coachee } from '../models/coachee.model';

const INCLUDE_FIELDS = [
  'user',
  'organization',
  'coachingAreas',
  'coachAppointment',
  'coachingSessions',
  'coachEvaluations',
];

@Injectable()
export class CoacheeService {
  async createCoachee(coacheeData: CoacheeDto): Promise<Coachee> {
    return Coachee.create(coacheeData);
  }

  async editCoachees(
    id: Identifier | Identifier[],
    coacheeData: EditCoacheeDto,
  ): Promise<Coachee | Coachee[]> {
    const [, result] = await Coachee.update(coacheeData, {
      where: { id },
      returning: true,
    });
    return Array.isArray(id) ? result : result[0];
  }

  async deleteCoachees(ids: Identifier | Array<Identifier>): Promise<number> {
    return Coachee.destroy({ where: { ids } });
  }

  async getCoachee(id: Identifier): Promise<Coachee> {
    return Coachee.findByPk(id, {
      include: INCLUDE_FIELDS,
    });
  }

  async getCoachees(where?: object): Promise<Coachee[]> {
    return Coachee.findAll({
      where,
      include: INCLUDE_FIELDS,
    });
  }
}
