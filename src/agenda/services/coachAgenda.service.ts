import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { DayAvailabilityInterface } from '../interfaces/availabilityCalendar.interface';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';
import { validateFromToDates } from 'src/agenda/services/validators/availabilityDatesValidator';
import { dayOfWeekAsString } from 'src/agenda/common/dayOfWeekAsString';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { HoursIntervalInterface } from 'src/agenda/interfaces/availabilityRange.interface';
import { getDateAndSetHour } from 'src/common/functions/getDateAndSetHour';
import { DayAvailabilityObjectType } from 'src/agenda/models/availabilityCalendar.model';
import { CoachAgendaRepository } from 'src/agenda/repositories/coachAgenda.repository';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';
import { CreateCoachAgendaDto } from 'src/agenda/dto/coachAgenda.dto';
import { Coach } from 'src/coaching/models/coach.model';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Injectable()
export class CoachAgendaService extends BaseService<CoachAgenda> {
  constructor(
    protected readonly repository: CoachAgendaRepository,
    private coachAppointmentService: CoachAppointmentService,
    private coachAgendaDayService: CoachAgendaDayService,
    private coreConfigService: CoreConfigService,
    private coachAgendaDayValidator: CoachAgendaDayValidator,
  ) {
    super();
  }

  async update(id: number, data: Partial<CoachAgenda>): Promise<CoachAgenda> {
    for (const dayIntervals of Object.values(data.availabilityRange)) {
      await this.coachAgendaDayValidator.validateHoursIntervals(dayIntervals);
    }
    return this.repository.update(id, data);
  }

  /**
   * Arma un objeto de meses y dias, donde para cada dia se revisa su configuracion
   * y citas. Retornando la disponibilidad del Coach
   */
  async getAvailabilityByMonths(
    coachAgenda: CoachAgenda,
    from: Date,
    to: Date,
  ): Promise<DayAvailabilityObjectType[]> {
    //Validate Provided Dates against System Config
    const { value: maxDistance } =
      await this.coreConfigService.getMaxDistanceForCoachAvalailabityQuery();

    const { value: minSessionDuration } =
      await this.coreConfigService.getMinCoachingSessionDuration();

    validateFromToDates(from, to, parseInt(maxDistance));

    const fromDate = dayjs(from);
    const toDate = dayjs(to);

    const [agendaDays, coachAppointments] = await Promise.all([
      this.coachAgendaDayService.getCoachAgendaDaysBetweenDates({
        coachAgendaId: coachAgenda.id,
        from: fromDate,
        to: toDate,
      }),
      this.coachAppointmentService.getCoachAppointmetsByDateRange(
        coachAgenda.id,
        from,
        to,
      ),
    ]);

    let loopdate = dayjs(from);
    const availableDays: DayAvailabilityInterface[] = [];

    while (loopdate.isSameOrBefore(to)) {
      // Disponibilidad para el dia
      const dayAvailability: DayAvailabilityInterface = {
        date: null,
        availability: null,
      };
      dayAvailability.date = dayjs(loopdate, 'DD-MM-YYY').toDate();

      // Revisamos si el dia esta excluido, o tiene algun intervalo de horas
      // especifico. Si no, seteamos las horas como se tienen configuradas
      const dayConfig = agendaDays.find(({ day }) => loopdate.isSame(day));
      if (dayConfig) {
        if (dayConfig.exclude) {
          loopdate = loopdate.add(1, 'day');
          continue;
        }
        dayAvailability.availability = dayConfig.availableHours;
      } else {
        dayAvailability.availability =
          coachAgenda.availabilityRange[dayOfWeekAsString(loopdate.day())];
      }

      // Revisamos si las citas del dia estan en algun intervalo de disponibilidad
      // para excluir ese intervalo
      const appointments = coachAppointments.filter(
        ({ startDate: appointmentDate }) =>
          loopdate.isSame(appointmentDate, 'day'),
      );

      if (appointments.length > 0) {
        dayAvailability.availability = this.calculateAvailability(
          appointments,
          dayAvailability.availability,
        );
      }

      // revisar que los intervalos de disponibilidad sean mayores o iguales al minimo
      dayAvailability.availability = dayAvailability.availability.filter(
        (interval) => {
          const from = getDateAndSetHour({ hour: interval.from });
          const to = getDateAndSetHour({ hour: interval.to });

          return to.diff(from, 'm') >= parseInt(minSessionDuration);
        },
      );

      availableDays.push(dayAvailability);

      loopdate = loopdate.add(1, 'day');
    }

    return availableDays;
  }

  calculateAvailability(
    appointments: CoachAppointment[],
    availability: HoursIntervalInterface[],
    index = 0,
  ): HoursIntervalInterface[] {
    const appointmentStart = dayjs(appointments[index].startDate);
    const appointmentEnd = dayjs(appointments[index].endDate);

    for (const availabilityHour of availability) {
      const availabilityFromDate = getDateAndSetHour({
        date: appointments[index].startDate,
        hour: availabilityHour.from,
      });

      const availabilityToDate = getDateAndSetHour({
        date: appointments[index].startDate,
        hour: availabilityHour.to,
      });

      if (
        availabilityFromDate.isSameOrBefore(appointmentStart) &&
        availabilityToDate.isSameOrAfter(appointmentEnd)
      ) {
        const newAvailability = [
          ...availability.filter((item) => item !== availabilityHour),
          {
            from: availabilityFromDate.format('HH:mm'),
            to: appointmentStart.format('HH:mm'),
          },
          {
            from: appointmentEnd.format('HH:mm'),
            to: availabilityToDate.format('HH:mm'),
          },
        ];

        return index + 1 >= appointments.length
          ? newAvailability
          : this.calculateAvailability(
              appointments,
              newAvailability,
              index + 1,
            );
      }
    }
  }
  async createCoachAgendaWithCoach(
    createCoachAgendaDto: Partial<CreateCoachAgendaDto>,
    coach: Coach,
  ): Promise<CoachAgenda> {
    const coachAgenda = await this.repository.create(createCoachAgendaDto);
    if (coachAgenda && coach) {
      await this.repository.relationQueryBuiler(coachAgenda, coach);
      return coachAgenda;
    }
  }
}
