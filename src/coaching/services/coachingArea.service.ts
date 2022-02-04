import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';

@Injectable()
export class CoachingAreaService extends BaseService<CoachingArea> {
  constructor(
    @InjectRepository(CoachingArea)
    protected readonly repository: Repository<CoachingArea>,
  ) {
    super();
  }
}
