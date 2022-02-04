import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { CoreConfig } from 'src/config/models/coreConfig.model';
import { Repository } from 'typeorm';

@Injectable()
export class CoreConfigService extends BaseService<CoreConfig> {
  constructor(
    @InjectRepository(CoreConfig)
    protected readonly repository: Repository<CoreConfig>,
  ) {
    super();
  }
}
