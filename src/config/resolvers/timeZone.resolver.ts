import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { TimeZoneDto, EditTimeZoneDto } from 'src/config/dto/timeZone.dto';
import { TimeZone } from 'src/config/models/timeZone.model';
import { TimeZoneService } from 'src/config/services/timeZone.service';

@Resolver(() => TimeZone)
@UseGuards(JwtAuthGuard)
export class TimeZoneResolver extends BaseResolver(TimeZone, {
  create: TimeZoneDto,
  update: EditTimeZoneDto,
}) {
  constructor(protected readonly service: TimeZoneService) {
    super();
  }

  @Query(() => [TimeZone])
  async getAllTimeZones(): Promise<TimeZone[]> {
    return this.service.getAllTimeZones();
  }

  @Query(() => TimeZone)
  async getTimeZonesByTimeZoneId(
    @Args('id', { type: () => Number }) timeZoneId: number,
  ): Promise<TimeZone> {
    return this.service.getTimeZonesByTimeZoneId(timeZoneId);
  }

  @Query(() => [TimeZone])
  async getTimeZonesByLabel(
    @Args('label', { type: () => String }) label: string,
  ): Promise<TimeZone[]> {
    return this.service.getTimeZonesByLabel(label);
  }

  @Query(() => [TimeZone])
  async getTimeZonesByTzCode(
    @Args('tzCode', { type: () => String }) tzCode: string,
  ): Promise<TimeZone[]> {
    return this.service.getTimeZonesByLabel(tzCode);
  }

  @Query(() => [TimeZone])
  async getTimeZonesByName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<TimeZone[]> {
    return this.service.getTimeZonesByName(name);
  }

  @Query(() => [TimeZone])
  async getTimeZonesByUtc(
    @Args('utc', { type: () => String }) utc: string,
  ): Promise<TimeZone[]> {
    return this.service.getTimeZonesByUtc(utc);
  }
}
