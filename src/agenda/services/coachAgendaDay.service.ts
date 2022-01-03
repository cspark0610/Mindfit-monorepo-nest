import { Injectable } from '@nestjs/common';
import { CoachAgendaDayDto } from '../dto/coachAgendaDay.dto';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';

@Injectable()
export class coachAgendaDayService {
  async createCoachAgendaDay(
    coachAgendaDayData: CoachAgendaDayDto,
  ): Promise<CoachAgendaDay> {
    return CoachAgendaDay.create({ ...coachAgendaDayData });
  }

  async editCoachAgendaDay(
    id: number,
    coachAgendaDayData: CoachAgendaDayDto,
  ): Promise<CoachAgendaDay> {
    return CoachAgendaDay.update(
      { ...coachAgendaDayData },
      { where: { id } },
    )[1];
  }

  async bulkEditCoachAgendaDays(
    ids: Array<number>,
    coachAgendaDayData: CoachAgendaDayDto,
  ): Promise<[number, CoachAgendaDay[]]> {
    return CoachAgendaDay.update(
      { ...coachAgendaDayData },
      { where: { id: ids } },
    );
  }

  async deactivateCoachAgendaDay(id: number): Promise<CoachAgendaDay> {
    return CoachAgendaDay.update({ isActive: false }, { where: { id } })[1];
  }

  async deleteCoachAgendaDay(id: number): Promise<number> {
    return CoachAgendaDay.destroy({ where: { id } });
  }

  async bulkDeleteCoachAgendaDays(ids: Array<number>): Promise<number> {
    return CoachAgendaDay.destroy({ where: { id: ids } });
  }

  async getCoachAgendaDay(id: number): Promise<CoachAgendaDay> {
    return CoachAgendaDay.findByPk(id);
  }

  async getCoachAgendaDays(where: object): Promise<CoachAgendaDay[]> {
    return CoachAgendaDay.findAll({ where });
  }
}
