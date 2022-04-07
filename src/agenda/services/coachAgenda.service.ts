import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import {
  DateHoursIntervalInterface,
  HoursIntervalInterface,
} from 'src/agenda/interfaces/availabilityRange.interface';
import {
  getDateAndSetDateHour,
  getDateAndSetHour,
} from 'src/common/functions/getDateAndSetHour';
import { DayAvailabilityObjectType } from 'src/agenda/models/availabilityCalendar.model';
import { CoachAgendaRepository } from 'src/agenda/repositories/coachAgenda.repository';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';
import { CreateCoachAgendaDto } from 'src/agenda/dto/coachAgenda.dto';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Injectable()
export class CoachAgendaService extends BaseService<CoachAgenda> {
  constructor(
    protected readonly repository: CoachAgendaRepository,
    @Inject(forwardRef(() => CoachAppointmentService))
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

  async createCoachAgenda(data: CreateCoachAgendaDto): Promise<CoachAgenda> {
    const coachAgendaData: Partial<CreateCoachAgendaDto> =
      await CreateCoachAgendaDto.from(data);
    const coachAgenda: CoachAgenda = await this.repository.create(
      coachAgendaData,
    );
    return coachAgenda;
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

    const { value: defaultSessionDuration } =
      await this.coreConfigService.getDefaultSessionDuration();

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
      // especifico. Si no, seteamos las horas como se tienen configuradas en la configuracion de agenda del coach
      const dayConfig = agendaDays.find(({ day }) => loopdate.isSame(day));
      if (dayConfig) {
        if (dayConfig.exclude) {
          loopdate = loopdate.add(1, 'day');
          continue;
        }
        dayAvailability.availability = this.getAvailabilityInIntervals(
          dayAvailability.date,
          dayConfig.availableHours,
          parseInt(defaultSessionDuration),
        );
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

      availableDays.push({
        date: dayAvailability.date,
        availability: this.calculateAvailability(
          dayAvailability.date,
          appointments,
          dayAvailability.availability,
          parseInt(defaultSessionDuration),
        ),
      });

      loopdate = loopdate.add(1, 'day');
    }

    return availableDays;
  }

  calculateAvailability(
    date: Date,
    appointments: CoachAppointment[],
    availability: DateHoursIntervalInterface[],
    defaultSessionDuration: number,
  ) {
    let newAvailability = [...availability];
    if (appointments.length > 0) {
      newAvailability = this.excludeAppointmentHours(
        appointments,
        availability,
      );
    }
    return this.getAvailabilityInIntervals(
      date,
      newAvailability,
      defaultSessionDuration,
    );
  }

  /**
   * Excluye de los intervalos de horas, las horas que corresponden a las citas
   */
  excludeAppointmentHours(
    appointments: CoachAppointment[],
    availability: DateHoursIntervalInterface[],
    index = 0,
  ): DateHoursIntervalInterface[] {
    const appointmentStart = dayjs(appointments[index].startDate);
    const appointmentEnd = dayjs(appointments[index].endDate);

    for (const availabilityHour of availability) {
      const availabilityFromDate =
        typeof availabilityHour.from == 'string'
          ? getDateAndSetHour({
              date: appointments[index].startDate,
              hour: availabilityHour.from,
            })
          : getDateAndSetDateHour({
              date: appointments[index].startDate,
              hour: availabilityHour.from,
            });

      const availabilityToDate =
        typeof availabilityHour.to == 'string'
          ? getDateAndSetHour({
              date: appointments[index].endDate,
              hour: availabilityHour.to,
            })
          : getDateAndSetDateHour({
              date: appointments[index].endDate,
              hour: availabilityHour.to,
            });

      if (
        availabilityFromDate.isSameOrBefore(appointmentStart) &&
        availabilityToDate.isSameOrAfter(appointmentEnd)
      ) {
        const newAvailability = [
          ...availability.filter((item) => item !== availabilityHour),
          {
            from: availabilityFromDate.toDate(),
            to: appointmentStart.toDate(),
          },
          {
            from: appointmentEnd.toDate(),
            to: availabilityToDate.toDate(),
          },
        ];

        return index + 1 >= appointments.length
          ? newAvailability
          : this.excludeAppointmentHours(
              appointments,
              newAvailability,
              index + 1,
            );
      }
    }
  }

  /**
   * Particiona las horas disponibles segun la duracion por defecto de una sesion
   *
   * Dado que el en backend las horas se guardan como string, pero al front se devuelven como date
   * La funcion puede recibir ambos tipos de datos, debe validarse para trabajar en funcion si las horas
   * estan en string o en date
   */
  getAvailabilityInIntervals(
    date: Date,
    availability: HoursIntervalInterface[] | DateHoursIntervalInterface[],
    defaultSessionDuration: number,
  ): DateHoursIntervalInterface[] {
    return availability.flatMap((interval) => {
      let from =
        typeof interval.from == 'string'
          ? getDateAndSetHour({
              date: date,
              hour: interval.from,
            })
          : dayjs(interval.from);

      const to =
        typeof interval.to == 'string'
          ? getDateAndSetHour({
              date: date,
              hour: interval.to,
            })
          : dayjs(interval.to);

      const miniIntervals: DateHoursIntervalInterface[] = [];

      while (from.isBefore(to)) {
        let finalHour = from.add(defaultSessionDuration, 'minute');

        if (finalHour.isAfter(to)) {
          finalHour = to;
        }

        if (finalHour.diff(from, 'm') === defaultSessionDuration)
          miniIntervals.push({
            from: from.toDate(),
            to: finalHour.toDate(),
          });

        from = finalHour;
      }

      return miniIntervals;
    });
  }
}
