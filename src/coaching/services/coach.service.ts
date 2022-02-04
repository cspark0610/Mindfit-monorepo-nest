import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';

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
