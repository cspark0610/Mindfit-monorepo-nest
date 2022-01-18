import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatSectionResult } from '../models/satSectionResult.model';

@Injectable()
export class SatSectionResultsService extends BaseService<SatSectionResult> {
  constructor(
    @InjectRepository(SatSectionResult)
    protected readonly repository: Repository<SatSectionResult>,
  ) {
    super();
  }
}
