import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CoachAgendaDto } from '../dto/coachAgenda.dto';
import { CoachAgenda } from '../models/coachAgenda.model';

@Injectable()
export class CoachAgendaService {
  constructor(
    @InjectRepository(CoachAgenda)
    private coachAgendaRepository: Repository<CoachAgenda>,
  ) {}

  async createCoachAgenda(
    coachAgendaData: CoachAgendaDto,
  ): Promise<CoachAgenda> {
    const data = await CoachAgendaDto.from(coachAgendaData);
    return this.coachAgendaRepository.save(data);
  }

  async editCoachAgendas(
    id: number | Array<number>,
    // coachAgendaData: CoachAgendaDto, TODO
  ): Promise<CoachAgenda> {
    const result = await this.coachAgendaRepository
      .createQueryBuilder()
      .update()
      .set({})
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();
    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoachAgendas(id: number | Array<number>): Promise<number> {
    const result = await this.coachAgendaRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }

  async getCoachAgenda(id: number): Promise<CoachAgenda> {
    return this.coachAgendaRepository.findOne(id);
  }

  async getCoachAgendas(
    where: FindManyOptions<CoachAgenda>,
  ): Promise<CoachAgenda[]> {
    return this.coachAgendaRepository.find(where);
  }
}
