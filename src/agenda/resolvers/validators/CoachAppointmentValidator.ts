import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { getDateAndSetHour } from 'src/common/functions/getDateAndSetHour';
import { CoreConfigService } from 'src/config/services/coreConfig.service';

/**
 * Have validations for the input dates, like min distance, min session duration, etc
 */
@Injectable()
export class CoachAppointmentValidator {
  constructor(
    @Inject(forwardRef(() => CoachAppointmentService))
    private coachAppointmentService: CoachAppointmentService,
    private coreConfigService: CoreConfigService,
    @Inject(forwardRef(() => CoachAgendaService))
    private coachAgendaService: CoachAgendaService,
  ) {}

  /**
   * Perfom several validations for date range given by user to request
   * and appointment
   */
  async validateRequestAppointmentDate(startDate: Date, endDate: Date) {
    const currentDate = dayjs();
    const fromDate = dayjs(startDate);
    const toDate = dayjs(endDate);

    const { value: maxDistance } =
      await this.coreConfigService.getMaxDistanceForCoachAppointment();

    const { value: minSessionDuration } =
      await this.coreConfigService.getMinCoachingSessionDuration();

    const { value: maxSessionDuration } =
      await this.coreConfigService.getMaxCoachingSessionDuration();

    if (fromDate.isBefore(currentDate, 'day')) {
      throw new MindfitException({
        error: 'You can not check availability for dates prior to today.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
      });
    }

    if (fromDate.isAfter(toDate, 'hour')) {
      throw new MindfitException({
        error: '"to date" must be greater than "from date".',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
      });
    }

    if (!toDate.isSame(fromDate, 'day')) {
      throw new MindfitException({
        error: 'Dates must be on the same day',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.BAD_DATE_INPUT,
      });
    }

    if (
      dayjs(endDate).diff(startDate, 'minute') < parseInt(minSessionDuration)
    ) {
      throw new MindfitException({
        error: `You cannot schedule a session for less than ${minSessionDuration} minutes`,
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.LESS_THAN_MINIMUN_SESSION_DURATION,
      });
    }

    if (
      dayjs(startDate).diff(endDate, 'minute') > parseInt(maxSessionDuration)
    ) {
      throw new MindfitException({
        error: `You cannot schedule a session for more than ${maxSessionDuration} minutes`,
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.LESS_THAN_MINIMUN_SESSION_DURATION,
      });
    }

    if (
      dayjs(new Date()).diff(dayjs(startDate), 'day') > parseInt(maxDistance)
    ) {
      throw new MindfitException({
        error: `You cannot schedule for more than ${maxDistance} days`,
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.EXCEEDS_MAXIMUN_APPOINTMENT_DISTANCE,
      });
    }
  }

  /**
   * Validate that coachee have not exceeded the limit of appointments per month.
   */
  async validateMaxCoacheeAppointments(coacheeId: number, startDate: Date) {
    const firstDay = dayjs(startDate).date(1); //First Day of Month
    const lastDay = dayjs(startDate).date(firstDay.daysInMonth()); //Last Day of month;
    const { value: maxAppointmentsPerMonth } =
      await this.coreConfigService.getMaxAppointmentsPerMonth();

    const coacheeAppointments =
      await this.coachAppointmentService.getCoacheeAppointmentsByDateRange(
        coacheeId,
        firstDay.toDate(),
        lastDay.toDate(),
      );

    if (coacheeAppointments.length >= parseInt(maxAppointmentsPerMonth)) {
      throw new MindfitException({
        error: 'You have exceeded the limit of appointments per month.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.EXCEEDS_MAXIMUN_APPOINTMENT_PER_MONTH,
      });
    }
  }

  /**
   * Validate coach availability in the given hours
   * taking care about appointments, coach agenda days, and available hours
   * in agenda.
   */
  async validateCoachAvailabilityByDateRange(
    coachAgendaId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const agenda = await this.coachAgendaService.findOne(coachAgendaId);
    // startDate and endDate are in the same date, so we must have only
    // one result
    const coachAvailability =
      await this.coachAgendaService.getAvailabilityByMonths(
        agenda,
        startDate,
        endDate,
      );

    // Validate that startDate and endDate are in the available hours
    const isAvailable = coachAvailability[0].availability.find(
      (availableHours) =>
        dayjs(startDate).isBetween(
          getDateAndSetHour({ date: startDate, hour: availableHours.from }),
          getDateAndSetHour({ date: endDate, hour: availableHours.to }),
          'minute',
          '[]',
        ) &&
        dayjs(endDate).isBetween(
          getDateAndSetHour({ date: startDate, hour: availableHours.from }),
          getDateAndSetHour({ date: endDate, hour: availableHours.to }),
          'minute',
          '[]',
        ),
    );

    if (!isAvailable) {
      throw new MindfitException({
        error: 'The coach has no availability for those dates',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: AgendaErrorsEnum.COACH_HAS_NO_AVAILABILITY,
      });
    }
  }
}
