import { Injectable } from '@nestjs/common';
import { Coach } from '../models/coach.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { CoachDto } from '../dto/coach.dto';

@Injectable()
export class CoachService extends BaseService<Coach> {
  constructor(
    @InjectRepository(Coach)
    protected readonly repository: Repository<Coach>,
  ) {
    super();
  }
  async create(coachData: CoachDto): Promise<Coach> {
    const data = await CoachDto.from(coachData);
    return this.repository.save(data);
  }
}
