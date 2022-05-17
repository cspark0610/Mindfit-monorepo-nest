import { Injectable } from '@nestjs/common';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachingAreaRepository } from 'src/coaching/repositories/coachingArea.repository';
import { BaseService } from 'src/common/service/base.service';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@Injectable()
export class CoachingAreaService extends BaseService<CoachingArea> {
  constructor(protected readonly repository: CoachingAreaRepository) {
    super();
  }
  async getManyCochingAreaByCodenames({
    codenames,
    relations,
  }: {
    codenames: Array<string>;
    relations?: QueryRelationsType;
  }) {
    return this.repository.getManyCochingAreaByCodenames({
      codenames,
      relations,
    });
  }

  async getManyCochingAreasByIds({
    ids,
    relations,
  }: {
    ids: number[];
    relations?: QueryRelationsType;
  }) {
    return this.repository.getManyCochingAreasByIds({ ids, relations });
  }
}
