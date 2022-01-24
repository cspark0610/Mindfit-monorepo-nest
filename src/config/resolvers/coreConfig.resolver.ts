import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { CoreConfigDto } from '../dto/coreConfig.dto';
import { ConfigCodeNames, CoreConfig } from '../models/coreConfig.model';
import { CoreConfigService } from '../services/coreConfig.service';

@Resolver(() => CoreConfig)
@UseGuards(JwtAuthGuard)
export class CoreConfigResolver extends BaseResolver(CoreConfig, {
  create: CoreConfigDto,
  update: CoreConfigDto,
}) {
  constructor(protected readonly service: CoreConfigService) {
    super();
  }

  @Query(() => CoreConfig)
  async getDefaultSat(): Promise<CoreConfig> {
    const result = await this.service.findAll({
      where: { codename: ConfigCodeNames.DEFAULT_SAT },
    });
    return result[0];
  }
}
