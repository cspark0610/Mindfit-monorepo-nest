import { Injectable } from '@nestjs/common';
import { CoachAppointmentDto } from '../dto/coachAppointment.dto';
import { CoachAppointment } from '../models/coachAppointment.model';

@Injectable()
export class coachAppointmentService {
  async createCoachAppointment(
    coachAppointmentDayData: CoachAppointmentDto,
  ): Promise<CoachAppointment> {
    return CoachAppointment.create({ ...coachAppointmentDayData });
  }

  async editCoachAppointment(
    id: number,
    coachAppointmentDayData: CoachAppointmentDto,
  ): Promise<CoachAppointment> {
    return CoachAppointment.update(
      { ...coachAppointmentDayData },
      { where: { id } },
    )[1];
  }

  async bulkEditCoachAppointments(
    ids: Array<number>,
    coachAppointmentDayData: CoachAppointmentDto,
  ): Promise<[number, CoachAppointment[]]> {
    return CoachAppointment.update(
      { ...coachAppointmentDayData },
      { where: { id: ids } },
    );
  }

  async deactivateCoachAppointment(id: number): Promise<CoachAppointment> {
    return CoachAppointment.update({ isActive: false }, { where: { id } })[1];
  }

  async deleteCoachAppointment(id: number): Promise<number> {
    return CoachAppointment.destroy({ where: { id } });
  }

  async bulkDeleteCoachAppointments(ids: Array<number>): Promise<number> {
    return CoachAppointment.destroy({ where: { id: ids } });
  }

  async getCoachAppointment(id: number): Promise<CoachAppointment> {
    return CoachAppointment.findByPk(id);
  }

  async getCoachAppointments(where: object): Promise<CoachAppointment[]> {
    return CoachAppointment.findAll({ where });
  }
}
