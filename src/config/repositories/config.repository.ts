import { EntityRepository } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoreConfig } from 'src/config/models/coreConfig.model';

@EntityRepository(CoreConfig)
export class CoreConfigRepository extends BaseRepository<CoreConfig> {}
