import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { CoachAgenda } from '../models/coachAgenda.model';

@Injectable()
export class CoachAgendaService extends BaseService<CoachAgenda> {
  constructor(
    @InjectRepository(CoachAgenda)
    protected readonly repository: Repository<CoachAgenda>,
  ) {
    super();
  }
}
