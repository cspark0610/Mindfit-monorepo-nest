import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { BaseService } from 'src/common/service/base.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class CoachService extends BaseService<Coach> {
  constructor(
    @InjectRepository(Coach)
    protected readonly repository: Repository<Coach>,
    private coachAgendaService: CoachAgendaService,
  ) {
    super();
  }
  async create(coachData: CoachDto): Promise<Coach> {
    const data = await CoachDto.from(coachData);
    const coach = await this.repository.save(data);
    await this.coachAgendaService.create({ coach });
    const result = await this.repository.findOne(coach.id, {
      relations: ['user', 'coachAgenda'],
    });
    return result;
  }

  async findAll(where?: FindManyOptions<Coach>): Promise<Coach[]> {
    return this.repository.find({ ...where, relations: ['user'] });
  }

  async findOne(id: number, options?: FindOneOptions<Coach>): Promise<Coach> {
    const result = await this.repository.findOne(id, {
      ...options,
      relations: ['user'],
    });
    if (!result) {
      throw new NotFoundException(
        `${this.repository.metadata.name} with id ${id} not found.`,
      );
    }
    return result;
  }
}
