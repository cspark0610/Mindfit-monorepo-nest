import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';

@Injectable()
export class coachAgendaDayService extends BaseService<CoachAgendaDay> {
  constructor(
    @InjectRepository(CoachAgendaDay)
    protected readonly repository: Repository<CoachAgendaDay>,
  ) {
    super();
  }
}
