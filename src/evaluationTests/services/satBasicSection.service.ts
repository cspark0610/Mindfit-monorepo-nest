import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatBasicSection } from '../models/satBasicSection.model';

@Injectable()
export class SatBasicSectionsService extends BaseService<SatBasicSection> {
  constructor(
    @InjectRepository(SatBasicSection)
    protected readonly repository: Repository<SatBasicSection>,
  ) {
    super();
  }
}
