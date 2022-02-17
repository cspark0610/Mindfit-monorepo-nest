import { HttpStatus, Injectable } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { ConfigCodeNames } from 'src/config/enums/configCodenames.enum';
import { CoreConfigErrors } from 'src/config/enums/coreConfigErrors.enum';
import { CoreConfig } from 'src/config/models/coreConfig.model';
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
      throw new MindfitException({
        error: 'CORE CONFIG - No MAX_APPOINTMENTS_PER_MONTH setted',
        errorCode: CoreConfigErrors.NO_CONFIG_SET,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
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
      throw new MindfitException({
        error: 'CORE CONFIG - No MAX_DISTANTE_COACH_AVAILABITY_QUERY setted',
        errorCode: CoreConfigErrors.NO_CONFIG_SET,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return result;
  }

  async getMaxCoachingSessionDuration() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.MAX_COACHING_SESSION_DURATION,
    });

    if (!result) {
      console.warn('CORE CONFIG - No MAX_COACHING_SESSION_DURATION setted');
      throw new MindfitException({
        error: 'CORE CONFIG - No MAX_COACHING_SESSION_DURATION setted',
        errorCode: CoreConfigErrors.NO_CONFIG_SET,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
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

  async getMaxCoachesSuggestions() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.MAX_COACHES_SUGGESTIONS,
    });

    if (!result) {
      console.warn('CORE CONFIG - No MAX_COACHES_SUGGESTIONS setted');
    }

    return result;
  }
  async getMaxCoachesSuggestedByRequest() {
    const result = await this.repository.findOneBy({
      codename: ConfigCodeNames.COACH_SUGGESTED_BY_REQUEST,
    });

    if (!result) {
      console.warn('CORE CONFIG - No COACH_SUGGESTED_BY_REQUEST setted');
    }

    return result;
  }
}
