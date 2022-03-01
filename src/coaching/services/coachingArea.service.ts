import { Injectable } from '@nestjs/common';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachingAreaRepository } from 'src/coaching/repositories/coachingArea.repository';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class CoachingAreaService extends BaseService<CoachingArea> {
  constructor(protected readonly repository: CoachingAreaRepository) {
    super();
  }
  async getManyCochingAreaByCodenames(codenames: Array<string>) {
    return this.repository.getManyCochingAreaByCodenames(codenames);
  }
}
