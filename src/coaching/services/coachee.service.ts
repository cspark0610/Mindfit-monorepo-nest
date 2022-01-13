import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { Coachee } from '../models/coachee.model';
@Injectable()
export class CoacheeService extends BaseService<Coachee> {
  constructor(
    @InjectRepository(Coachee)
    protected readonly repository: Repository<Coachee>,
  ) {
    super();
  }
}
