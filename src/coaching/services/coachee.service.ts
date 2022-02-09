import { Injectable } from '@nestjs/common';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { BaseService } from 'src/common/service/base.service';
@Injectable()
export class CoacheeService extends BaseService<Coachee> {
  constructor(protected readonly repository: CoacheeRepository) {
    super();
  }
}
