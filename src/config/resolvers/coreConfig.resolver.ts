import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
    return this.service.getDefaultCoachingSessionFeedback();
  }

  @Query(() => CoreConfig)
  async getDefaultDaysAsRecentCoacheeAssigned(): Promise<CoreConfig> {
    return this.service.defaultDaysAsRecentCoacheeAssigned();
  }

  @Query(() => CoreConfig)
  async getDaysCoacheeRecentRegistered(): Promise<CoreConfig> {
    return this.service.daysCoacheeRecentRegistered();
  }

  @Query(() => CoreConfig)
  async getDaysCoacheeWithoutActivity(): Promise<CoreConfig> {
    return this.service.daysCoacheeWithoutActivity();
  }
  @Query(() => CoreConfig)
  async getAllTimesZonesCoreConfig(): Promise<CoreConfig> {
    return this.service.getAllTimesZonesCoreConfig();
  }

  @Query(() => CoreConfig)
  async getTimeZonesCoreConfigByLabel(
    @Args('label', { type: () => String }) label: string,
  ): Promise<CoreConfig> {
    return this.service.getTimeZonesCoreConfigByLabel(label);
  }

  @Query(() => CoreConfig)
  async getTimeZonesCoreConfigByTzCode(
    @Args('tzCode', { type: () => String }) tzCode: string,
  ): Promise<CoreConfig> {
    return this.service.getTimeZonesCoreConfigByTzCode(tzCode);
  }

  @Query(() => CoreConfig)
  async getTimeZonesCoreConfigByName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<CoreConfig> {
    return this.service.getTimeZonesCoreConfigByName(name);
  }

  @Query(() => CoreConfig)
  async getTimeZonesCoreConfigByUtc(
    @Args('utc', { type: () => String }) utc: string,
  ): Promise<CoreConfig> {
    return this.service.getTimeZonesCoreConfigByUtc(utc);
  }

  @Mutation(() => CoreConfig)
  async createDefaultDaysAsRecientCoacheeAssigned(
    @Args('data', { type: () => CoreConfigDto }) data: CoreConfigDto,
  ): Promise<CoreConfig> {
    return this.service.createDefaultDaysAsRecentCoacheeAssigned(data);
  }

  @Mutation(() => CoreConfig)
  async createDaysCoacheeRecentRegistered(
    @Args('data', { type: () => CoreConfigDto }) data: CoreConfigDto,
  ): Promise<CoreConfig> {
    return this.service.createDaysCoacheeRecentRegistered(data);
  }

  @Mutation(() => CoreConfig)
  async createDaysCoacheeWithoutActivity(
    @Args('data', { type: () => CoreConfigDto }) data: CoreConfigDto,
  ): Promise<CoreConfig> {
    return this.service.createDaysCoacheeWithoutActivity(data);
  }

  @Mutation(() => CoreConfig)
  async createTimeZonesCoreConfig(
    @Args('data', { type: () => CoreConfigDto }) data: CoreConfigDto,
  ): Promise<CoreConfig> {
    return this.service.createTimeZonesCoreConfig(data);
  }
}
