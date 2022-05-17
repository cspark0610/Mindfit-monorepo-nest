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
    return this.findOne({ id: timeZoneId });
  }

  async getTimeZonesByLabel(label: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByLabel(label.trim());
  }

  async getTimeZonesByTzCode(tzCode: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByTzCode(tzCode.trim());
  }

  async getTimeZonesByName(name: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByName(name.trim());
  }

  async getTimeZonesByUtc(utc: string): Promise<TimeZone[]> {
    return this.repository.findTimeZonesByUtc(utc.trim());
  }
}
