import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachAppointmentDto } from 'src/agenda/dto/coachAppointment.dto';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CoachAppointmentService {
  constructor(
    @InjectRepository(CoachAppointment)
    private coachAppointmentRepository: Repository<CoachAppointment>,
  ) {}

  async createCoachAppointment(
    coachAppointmentDayData: CoachAppointmentDto,
  ): Promise<CoachAppointment> {
    const data = await CoachAppointmentDto.from(coachAppointmentDayData);
    return this.coachAppointmentRepository.save(data);
  }

  async editCoachAppointments(
    id: number | Array<number>,
    coachAppointmentDayData: CoachAppointmentDto,
  ): Promise<CoachAppointment | CoachAppointment[]> {
    const result = await this.coachAppointmentRepository
      .createQueryBuilder()
      .update()
      .set({ ...coachAppointmentDayData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();

    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoachAppointments(id: number | Array<number>): Promise<number> {
    const result = await this.coachAppointmentRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();

    return result.affected;
  }

  async getCoachAppointment(id: number): Promise<CoachAppointment> {
    return this.coachAppointmentRepository.findOne(id);
  }

  async getCoachAppointments(
    where: FindManyOptions<CoachAppointment>,
  ): Promise<CoachAppointment[]> {
    return this.coachAppointmentRepository.find(where);
  }
}
