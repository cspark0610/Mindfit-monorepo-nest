import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import {
  ConfigCodeNames,
  CoreConfig,
} from 'src/config/models/coreConfig.model';
import { Repository } from 'typeorm';

@Injectable()
export class CoreConfigService extends BaseService<CoreConfig> {
  constructor(
    @InjectRepository(CoreConfig)
    protected readonly repository: Repository<CoreConfig>,
  ) {
    super();
  }

  async getMaxAppointmentsPerMonth() {
    const result = await this.repository.findOne({
      where: { codename: ConfigCodeNames.MAX_APPOINTMENTS_PER_MONTH },
    });

    if (!result) {
      console.warn('CORE CONFIG - No MAX_APPOINTMENTS_PER_MONTH setted');
    }

    return result;
  }

  async getMaxDistanceForCoachAvalailabityQuery() {
    const result = await this.repository.findOne({
      where: { codename: ConfigCodeNames.MAX_DISTANTE_COACH_AVAILABITY_QUERY },
    });

    if (!result) {
      console.warn(
        'CORE CONFIG - No MAX_DISTANTE_COACH_AVAILABITY_QUERY setted',
      );
    }

    return result;
  }

  async getMinCoachingSessionDuration() {
    const result = await this.repository.findOne({
      where: { codename: ConfigCodeNames.MIN_COACHING_SESSION_DURATION },
    });

    if (!result) {
      console.warn('CORE CONFIG - No MIN_COACHING_SESSION_DURATION setted');
    }

    return result;
  }
}
