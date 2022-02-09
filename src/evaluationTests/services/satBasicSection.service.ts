import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatBasicSectionRepository } from 'src/evaluationTests/repositories/satBasicSection.repository';

@Injectable()
export class SatBasicSectionsService extends BaseService<SatBasicSection> {
  constructor(protected readonly repository: SatBasicSectionRepository) {
    super();
  }
}
