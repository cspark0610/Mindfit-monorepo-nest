import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachDto, EditCoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { BaseService } from 'src/common/service/base.service';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { coachEditErrors } from '../enums/coachEditError.enum';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { HistoricalCoacheeData } from 'src/coaching/models/historicalCoacheeData.model';
import { CoachingErrorEnum } from 'src/coaching/enums/coachingErrors.enum';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoachDashboardData } from 'src/coaching/models/coachDashboardData.model';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';

@Injectable()
export class CoachService extends BaseService<Coach> {
  constructor(
    protected readonly repository: CoachRepository,
    @Inject(forwardRef(() => CoachAgendaService))
    private coachAgendaService: CoachAgendaService,
    @Inject(forwardRef(() => CoacheeService))
    private coacheeService: CoacheeService,
    private historicalAssigmentService: HistoricalAssigmentService,
    private coreConfigService: CoreConfigService,
    @Inject(forwardRef(() => CoachAppointmentService))
    private coachAppointmentService: CoachAppointmentService,
  ) {
    super();
  }
  async create(coachData: CoachDto): Promise<Coach> {
    const data = await CoachDto.from(coachData);
    const coach = await this.repository.create(data);
    await this.coachAgendaService.create({ coach, outOfService: true });
    return this.repository.findOneBy({ id: coach.id });
  }

  async updateCoach(session: UserSession, data: EditCoachDto): Promise<Coach> {
    const coach: Coach = await this.getCoachByUserEmail(session.email);

    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachEditErrors.NOT_EXISTING_COACH,
      });
    }
    return this.repository.update(coach.id, data);
  }
  async updateCoachById(id: number, data: EditCoachDto): Promise<Coach> {
    const coach: Coach = await this.repository.findOneBy({ id });
    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachEditErrors.NOT_EXISTING_COACH,
      });
    }
    return this.repository.update(coach.id, data);
  }

  async getHistoricalCoacheeData(
    session: UserSession,
    coacheeId: number,
  ): Promise<HistoricalCoacheeData> {
    const coach: Coach = await this.getCoachByUserEmail(session.email);
    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachEditErrors.NOT_EXISTING_COACH,
      });
    }
    if (!coach.assignedCoachees.length) {
      throw new MindfitException({
        error: 'You do not have any coachees assigned.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingErrorEnum.NO_COACHEES_ASSIGNED,
      });
    }
    return this.coacheeService.getHistoricalCoacheeData(coach.id, coacheeId);
  }

  async getRandomInServiceCoaches(
    quantity: number,
    exclude?: number[],
  ): Promise<Coach[]> {
    const coaches = await this.getInServiceCoaches(exclude);
    return coaches.sort(() => 0.5 - Math.random()).slice(0, quantity);
  }

  async getHistoricalAssigment(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    return this.historicalAssigmentService.getAllHistoricalAssigmentsByCoachId(
      session,
    );
  }

  async getCoachDashboardData(
    session: UserSession,
  ): Promise<CoachDashboardData> {
    const coach: Coach = await this.getCoachByUserEmail(session.email);

    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachEditErrors.NOT_EXISTING_COACH,
      });
    }

    return {
      coacheesWithUpcomingAppointments:
        await this.getCoacheesWithUpcomingAppointments(coach.id),
      coacheesWithoutRecentActivity:
        await this.getCoacheesWithoutRecentActivity(),
      coacheesRecentlyRegistered: await this.getCoacheesRecentlyRegistered(),
    };
  }

  async getInServiceCoaches(exclude?: number[]): Promise<Coach[]> {
    return this.repository.getInServiceCoaches(exclude);
  }

  async getCoachByUserEmail(email: string): Promise<Coach> {
    return this.repository.getCoachByUserEmail(email);
  }

  async getCoacheesWithUpcomingAppointments(
    coachId: number,
  ): Promise<Coachee[]> {
    const coacheesWithCoachAppointments: Coachee[] =
      await this.coacheeService.getCoacheesWithUpcomingAppointmentsByCoachId(
        coachId,
      );

    return coacheesWithCoachAppointments;
  }

  async getCoacheesRecentlyRegistered(): Promise<Coachee[]> {
    const daysRecentRegistered: number =
      await this.coreConfigService.getDaysCoacheeRecentRegistered();
    return this.coacheeService.getCoacheesRecentlyRegistered(
      daysRecentRegistered,
    );
  }

  async getCoacheesWithoutRecentActivity() {
    const daysWithoutActivity: number =
      await this.coreConfigService.getDaysCoacheeWithoutActivity();
    return this.coacheeService.getCoacheesWithoutRecentActivity(
      daysWithoutActivity,
    );
  }
}
