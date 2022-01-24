import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { CoreConfig } from '../models/coreConfig.model';

@Injectable()
export class CoreConfigService extends BaseService<CoreConfig> {
  constructor(
    @InjectRepository(CoreConfig)
    protected readonly repository: Repository<CoreConfig>,
  ) {
    super();
  }
}
