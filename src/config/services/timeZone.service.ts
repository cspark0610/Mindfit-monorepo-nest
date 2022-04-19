import { Injectable } from '@nestjs/common';
import { TimeZone } from 'src/config/models/timeZone.model';
import { BaseService } from 'src/common/service/base.service';
import { TimeZoneRepository } from 'src/config/repositories/timeZone.repository';

@Injectable()
export class TimeZoneService extends BaseService<TimeZone> {
  constructor(protected readonly repository: TimeZoneRepository) {
    super();
  }

  async getAllTimeZones(): Promise<TimeZone[]> {
    return this.repository.findAllTimesZones();
  }
  async getTimeZonesByTimeZoneId(timeZoneId: number): Promise<TimeZone> {
    return this.findOne(timeZoneId);
  }

  async getTimeZonesByLabel(label: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByLabel(label);
  }

  async getTimeZonesByTzCode(tzCode: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByTzCode(tzCode);
  }

  async getTimeZonesByName(name: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByName(name);
  }

  async getTimeZonesByUtc(utc: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByUtc(utc);
  }
}
