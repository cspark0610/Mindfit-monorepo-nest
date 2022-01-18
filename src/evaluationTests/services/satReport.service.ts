import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatReport } from '../models/satReport.model';

@Injectable()
export class SatReportsService extends BaseService<SatReport> {
  constructor(
    @InjectRepository(SatReport)
    protected readonly repository: Repository<SatReport>,
  ) {
    super();
  }
}
