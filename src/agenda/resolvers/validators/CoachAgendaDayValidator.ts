import { HttpStatus, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { HoursIntervalInterface } from 'src/agenda/interfaces/availabilityRange.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { getDateAndSetHour } from 'src/common/functions/getDateAndSetHour';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

@Injectable()
export class CoachAgendaDayValidator {
  constructor(private coreConfigService: CoreConfigService) {}
  /**
   * Iterate through AvailableHours to validate
   *  - Non-overlapping hours
   *  - Hours intervals meet the minimun session duration
   */
  async validateHoursIntervals(hoursIntervals: HoursIntervalInterface[]) {
    const { value: defaultSessionDuration } =
      await this.coreConfigService.getDefaultSessionDuration();

    // Validate min Duration
    const hoursIntervalsWithDate = hoursIntervals.map((interval) => {
      const from = getDateAndSetHour({ hour: interval.from });
      const to = getDateAndSetHour({ hour: interval.to });

      if (to.isSameOrBefore(from)) {
        throw new MindfitException({
          error: `"To hour" must be grater that "From hour".`,
          errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      if (to.diff(from, 'minute') < parseInt(defaultSessionDuration)) {
        throw new MindfitException({
          error: `${interval.from} - ${interval.to} does not meet the minimun session duration.`,
          errorCode: AgendaErrorsEnum.LESS_THAN_MINIMUN_SESSION_DURATION,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      return { from, to };
    });

    const overlap = hoursIntervalsWithDate.filter(
      (item, index) =>
        hoursIntervalsWithDate.filter(
          (actual, innerIndex) =>
            index !== innerIndex &&
            (dayjs(item.from).isBetween(actual.from, actual.to) ||
              dayjs(item.to).isBetween(actual.from, actual.to)),
        ).length > 0,
    );

    if (overlap.length > 1) {
      throw new MindfitException({
        error: `Overlap with other intervals.`,
        errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
        statusCode: HttpStatus.BAD_REQUEST,
        extra: {
          overlap,
        },
      });
    }
  }
}
