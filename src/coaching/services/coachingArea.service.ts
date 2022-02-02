import { Injectable } from '@nestjs/common';
import { CoachingArea } from '../models/coachingArea.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class CoachingAreaService extends BaseService<CoachingArea> {
  constructor(
    @InjectRepository(CoachingArea)
    protected readonly repository: Repository<CoachingArea>,
  ) {
    super();
  }
}
