import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { TimeZone } from 'src/config/models/timeZone.model';

@EntityRepository(TimeZone)
export class TimeZoneRepository extends BaseRepository<TimeZone> {
  getQueryBuilder(): SelectQueryBuilder<TimeZone> {
    return this.repository.createQueryBuilder('timeZone');
  }

  findAllTimesZones(): Promise<TimeZone[]> {
    return this.getQueryBuilder().getMany();
  }

  findTimeZonesByLabel(label: string): Promise<TimeZone[]> {
    return this.getQueryBuilder()
      .where('LOWER(timeZone.label) LIKE :label', {
        label: `%${label.toLowerCase()}%`,
      })
      .getMany();
  }

  findTimeZonesByTzCode(tzCode: string): Promise<TimeZone[]> {
    return this.getQueryBuilder()
      .where('LOWER(timeZone.tzCode) LIKE :tzCode', {
        tzCode: `%${tzCode.toLowerCase()}%`,
      })
      .getMany();
  }

  findTimeZonesByName(name: string): Promise<TimeZone[]> {
    return this.getQueryBuilder()
      .where('LOWER(timeZone.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      })
      .getMany();
  }

  findTimeZonesByUtc(utc: string): Promise<TimeZone[]> {
    return this.getQueryBuilder()
      .where('LOWER(timeZone.utc) LIKE :utc', { utc: `%${utc.toLowerCase()}%` })
      .getMany();
  }
}
