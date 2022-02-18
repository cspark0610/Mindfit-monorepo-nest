import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CoreConfigDto,
  EditCoreConfigDto,
} from 'src/config/dto/coreConfig.dto';
import { CoreConfig } from 'src/config/models/coreConfig.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';

@Resolver(() => CoreConfig)
@UseGuards(JwtAuthGuard)
export class CoreConfigResolver extends BaseResolver(CoreConfig, {
  create: CoreConfigDto,
  update: EditCoreConfigDto,
}) {
  constructor(protected readonly service: CoreConfigService) {
    super();
  }

  @Query(() => CoreConfig)
  async getDefaultSat(): Promise<CoreConfig> {
    return this.service.getDefaultSat();
  }

  @Query(() => CoreConfig)
  async getDefaultFeedbackForCoachingSession(): Promise<CoreConfig> {
    return this.service.getDefultCoachingSessionFeedback();
  }
}
