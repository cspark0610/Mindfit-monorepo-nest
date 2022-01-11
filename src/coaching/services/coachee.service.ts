import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CoacheeDto, EditCoacheeDto } from '../dto/coachee.dto';
import { Coachee } from '../models/coachee.model';
@Injectable()
export class CoacheeService {
  constructor(
    @InjectRepository(Coachee)
    private coacheeRepository: Repository<Coachee>,
  ) {}

  async getCoachee(id: number): Promise<Coachee> {
    return this.coacheeRepository.findOne(id);
  }
  async getCoachees(where?: FindManyOptions<Coachee>): Promise<Coachee[]> {
    return this.coacheeRepository.find(where);
  }

  async createCoachee(coacheeData: CoacheeDto): Promise<Coachee> {
    const data = await CoacheeDto.from(coacheeData);
    return this.coacheeRepository.save(data);
  }
  async editCoachees(
    id: number | number[],
    coacheeData: EditCoacheeDto,
  ): Promise<Coachee | Coachee[]> {
    const result = await this.coacheeRepository
      .createQueryBuilder()
      .update()
      .set({ ...coacheeData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();
    return Array.isArray(id) ? result.raw : result.raw[0];
  }
  async deleteCoachees(id: number | Array<number>): Promise<number> {
    const result = await this.coacheeRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }
}
