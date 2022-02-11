import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import {
  ConfigCodeNames,
  CoreConfig,
} from 'src/config/models/coreConfig.model';
import { CoreConfigRepository } from 'src/config/repositories/config.repository';

@Injectable()
export class CoreConfigService extends BaseService<CoreConfig> {
  constructor(protected readonly repository: CoreConfigRepository) {
    super();
  }

  async getMaxAppointmentsPerMonth() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.MAX_APPOINTMENTS_PER_MONTH,
    });

    if (!result) {
      console.warn('CORE CONFIG - No MAX_APPOINTMENTS_PER_MONTH setted');
    }

    return result;
  }

  async getMaxDistanceForCoachAvalailabityQuery() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.MAX_DISTANTE_COACH_AVAILABITY_QUERY,
    });

    if (!result) {
      console.warn(
        'CORE CONFIG - No MAX_DISTANTE_COACH_AVAILABITY_QUERY setted',
      );
    }

    return result;
  }

  async getMaxCoachingSessionDuration() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.MAX_COACHING_SESSION_DURATION,
    });

    if (!result) {
      console.warn('CORE CONFIG - No MAX_COACHING_SESSION_DURATION setted');
    }

    return result;
  }

  async getMinCoachingSessionDuration() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.MIN_COACHING_SESSION_DURATION,
    });

    if (!result) {
      console.warn('CORE CONFIG - No MIN_COACHING_SESSION_DURATION setted');
    }

    return result;
  }

  async getMaxDistanceForCoachAppointment() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.MAX_DISTANTE_COACH_APPOINTMENT,
    });

    if (!result) {
      console.warn('CORE CONFIG - No MAX_DISTANTE_COACH_APPOINTMENT setted');
    }

    return result;
  }
}
