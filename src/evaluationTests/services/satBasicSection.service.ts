import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { Repository } from 'typeorm';

@Injectable()
export class SatBasicSectionsService extends BaseService<SatBasicSection> {
  constructor(
    @InjectRepository(SatBasicSection)
    protected readonly repository: Repository<SatBasicSection>,
  ) {
    super();
  }
}
