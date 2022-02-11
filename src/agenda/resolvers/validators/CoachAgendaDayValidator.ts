import { Injectable } from '@nestjs/common';
import { CreateCoachAgendaDayDto } from 'src/agenda/dto/coachAgendaDay.dto';
import { CoreConfigService } from 'src/config/services/coreConfig.service';

@Injectable()
export class CoachAgendaDayValidator {
  constructor(private coreConfigService: CoreConfigService) {}
  /**
   * Iterate through data (Day, AvailableHours, exclude) to validate
   *  - No Repeated Days
   *  - Non-overlapping hours
   *  - Hours intervals meet the minimun session duration
   */
  async validateDayAndHoursIntervals(
    CoachAgendaDayData: CreateCoachAgendaDayDto,
  ) {
    const { value: minSessionDuration } =
      await this.coreConfigService.getMinCoachingSessionDuration();
  }
}
