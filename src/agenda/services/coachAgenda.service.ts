import { Injectable } from '@nestjs/common';
import { CoachAgendaDto } from '../dto/coachAgenda.dto';
import { CoachAgenda } from '../models/coachAgenda.model';

@Injectable()
export class coachAgendaService {
  async createCoachAgenda(
    coachAgendaData: CoachAgendaDto,
  ): Promise<CoachAgenda> {
    return CoachAgenda.create({ ...coachAgendaData });
  }

  async editCoachAgenda(
    id: number,
    coachAgendaData: CoachAgendaDto,
  ): Promise<CoachAgenda> {
    return CoachAgenda.update({ ...coachAgendaData }, { where: { id } })[1];
  }

  async bulkEditCoachAgendas(
    ids: Array<number>,
    coachAgendaData: CoachAgendaDto,
  ): Promise<[number, CoachAgenda[]]> {
    return CoachAgenda.update({ ...coachAgendaData }, { where: { id: ids } });
  }

  async deactivateCoachAgenda(id: number): Promise<CoachAgenda> {
    return CoachAgenda.update({ isActive: false }, { where: { id } })[1];
  }

  async deleteCoachAgenda(id: number): Promise<number> {
    return CoachAgenda.destroy({ where: { id } });
  }

  async bulkDeleteCoachAgendas(ids: Array<number>): Promise<number> {
    return CoachAgenda.destroy({ where: { id: ids } });
  }

  async getCoachAgenda(id: number): Promise<CoachAgenda> {
    return CoachAgenda.findByPk(id);
  }

  async getCoachAgendas(where: object): Promise<CoachAgenda[]> {
    return CoachAgenda.findAll({ where });
  }
}
