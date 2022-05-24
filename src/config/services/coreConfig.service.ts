import { HttpStatus, Injectable } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { ConfigCodeNames } from 'src/config/enums/configCodenames.enum';
import { CoreConfigErrors } from 'src/config/enums/coreConfigErrors.enum';
import { CoreConfig } from 'src/config/models/coreConfig.model';
import { CoreConfigRepository } from 'src/config/repositories/config.repository';
import { CoreConfigDto } from 'src/config/dto/coreConfig.dto';
import { TimeZoneObjectType } from 'src/config/models/timeZone.model';
import { tzArray } from 'src/config/constants/timeZones.contants';

@Injectable()
export class CoreConfigService extends BaseService<CoreConfig> {
  constructor(protected readonly repository: CoreConfigRepository) {
    super();
  }

  async findConfigByCodename(codename: ConfigCodeNames): Promise<CoreConfig> {
    const result = await this.repository.findOneBy(
      { codename },
      { ref: 'coreconfig' },
    );

    if (!result) {
      console.warn(`CORE CONFIG - No ${codename} setted`);
      throw new MindfitException({
        error: `CORE CONFIG - No ${codename} setted`,
        errorCode: CoreConfigErrors.NO_CONFIG_SET,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return result;
  }

  async getDefaultSat(): Promise<CoreConfig> {
    return this.findConfigByCodename(ConfigCodeNames.DEFAULT_SAT);
  }

  async getMaxAppointmentsPerMonth(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.MAX_APPOINTMENTS_PER_MONTH,
    );
  }

  async getMaxDistanceForCoachAvalailabityQuery(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.MAX_DISTANTE_COACH_AVAILABITY_QUERY,
    );
  }

  async getMaxCoachingSessionDuration(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.MAX_COACHING_SESSION_DURATION,
    );
  }

  async getMinCoachingSessionDuration(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.MIN_COACHING_SESSION_DURATION,
    );
  }

  async getMaxDistanceForCoachAppointment(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.MAX_DISTANTE_COACH_APPOINTMENT,
    );
  }

  async getMaxCoachesSuggestions(): Promise<CoreConfig> {
    return this.findConfigByCodename(ConfigCodeNames.MAX_COACHES_SUGGESTIONS);
  }

  async getMaxCoachesSuggestedByRequest(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.COACH_SUGGESTED_BY_REQUEST,
    );
  }

  async getDefaultCoachingSessionFeedback(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.DEFAULT_COACHING_SESSION_FEEDBACK,
    );
  }
  async getDefaultDaysAsRecentCoacheeAssigned(): Promise<number> {
    const coreConfig = await this.findConfigByCodename(
      ConfigCodeNames.DAYS_NUMBER_ASSIGNED_COACHEE_AS_RECENT,
    );
    return Number(coreConfig.value);
  }
  async defaultDaysAsRecentCoacheeAssigned(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.DAYS_NUMBER_ASSIGNED_COACHEE_AS_RECENT,
    );
  }

  async getDaysCoacheeRecentRegistered(): Promise<number> {
    const coreConfig = await this.findConfigByCodename(
      ConfigCodeNames.DAYS_COACHEE_RECENT_REGISTERED,
    );
    return Number(coreConfig.value);
  }

  async daysCoacheeRecentRegistered(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.DAYS_COACHEE_RECENT_REGISTERED,
    );
  }
  async getDaysCoacheeWithoutActivity(): Promise<number> {
    const coreConfig = await this.findConfigByCodename(
      ConfigCodeNames.DAYS_COACHEE_WITHOUT_ACTIVITY,
    );
    return Number(coreConfig.value);
  }

  async daysCoacheeWithoutActivity(): Promise<CoreConfig> {
    return this.findConfigByCodename(
      ConfigCodeNames.DAYS_COACHEE_WITHOUT_ACTIVITY,
    );
  }

  async getDefaultSessionDuration(): Promise<CoreConfig> {
    const coreConfig = await this.findConfigByCodename(
      ConfigCodeNames.DEFAULT_SESSION_DURATION,
    );
    return coreConfig;
  }

  async getAllTimesZonesCoreConfig(): Promise<CoreConfig> {
    const coreConfig = await this.findConfigByCodename(
      ConfigCodeNames.TIME_ZONES,
    );
    return coreConfig;
  }
  generateArrayTimeZones(array): TimeZoneObjectType[] {
    const res = [];
    for (let i = 0; i < array.length; i++) {
      res.push({
        label: array[i].label,
        name: array[i].name,
        tzCode: array[i].tzCode,
        utc: array[i].utc,
      });
    }
    return res;
  }

  async getAllTimesZones(): Promise<TimeZoneObjectType[]> {
    const coreConfig = await this.findConfigByCodename(
      ConfigCodeNames.TIME_ZONES,
    );
    const result = JSON.parse(coreConfig.jsonValue);
    return this.generateArrayTimeZones(result);
  }

  async getTimeZonesByLabel(label: string): Promise<TimeZoneObjectType[]> {
    const coreConfig = await this.getAllTimesZonesCoreConfig();
    const result = JSON.parse(coreConfig.jsonValue);
    return this.generateArrayTimeZones(result).filter(
      (item) => item.label.toLowerCase() === label.toLowerCase(),
    );
  }

  async getTimeZonesByTzCode(tzCode: string): Promise<TimeZoneObjectType[]> {
    const coreConfig = await this.getAllTimesZonesCoreConfig();
    const result = JSON.parse(coreConfig.jsonValue);
    return this.generateArrayTimeZones(result).filter(
      (item) => item.tzCode.toLowerCase() === tzCode.toLowerCase(),
    );
  }

  async getTimeZonesByName(name: string): Promise<TimeZoneObjectType[]> {
    const coreConfig = await this.getAllTimesZonesCoreConfig();
    const result = JSON.parse(coreConfig.jsonValue);
    return this.generateArrayTimeZones(result).filter(
      (item) => item.name.toLowerCase() === name.toLowerCase(),
    );
  }

  async getTimeZonesByUtc(utc: string): Promise<TimeZoneObjectType[]> {
    const coreConfig = await this.getAllTimesZonesCoreConfig();
    const result = JSON.parse(coreConfig.jsonValue);
    return this.generateArrayTimeZones(result).filter(
      (item) => item.utc.toLowerCase() === utc.toLowerCase(),
    );
  }

  async createDefaultDaysAsRecentCoacheeAssigned(
    data: CoreConfigDto,
  ): Promise<CoreConfig> {
    const d = {
      ...data,
      codename: ConfigCodeNames.DAYS_NUMBER_ASSIGNED_COACHEE_AS_RECENT,
    };
    return this.repository.create(d);
  }

  async createDaysCoacheeRecentRegistered(data: CoreConfigDto) {
    const d = {
      ...data,
      codename: ConfigCodeNames.DAYS_COACHEE_RECENT_REGISTERED,
    };
    return this.repository.create(d);
  }

  async createDaysCoacheeWithoutActivity(data: CoreConfigDto) {
    const d = {
      ...data,
      codename: ConfigCodeNames.DAYS_COACHEE_WITHOUT_ACTIVITY,
    };
    return this.repository.create(d);
  }

  async createTimeZonesCoreConfig(data: CoreConfigDto): Promise<CoreConfig> {
    const d = {
      ...data,
      codename: ConfigCodeNames.TIME_ZONES,
      jsonValue: JSON.stringify(tzArray),
    };
    return this.repository.create(d);
  }
}
