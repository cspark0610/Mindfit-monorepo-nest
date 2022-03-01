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
import { HistoricalAssigmentRepository } from 'src/coaching/repositories/historicalAssigment.repository';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { CoreConfig } from 'src/config/models/coreConfig.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';

@Injectable()
export class CoachService extends BaseService<Coach> {
  constructor(
    protected readonly repository: CoachRepository,
    @Inject(forwardRef(() => CoachAgendaService))
    private coachAgendaService: CoachAgendaService,
    @Inject(forwardRef(() => CoacheeService))
    private coacheeService: CoacheeService,
    private historicalAssigmentRepository: HistoricalAssigmentRepository,
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
    return this.coacheeService.getHistoricalCoacheeData(coach.id);
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
    const coach: Coach = await this.getCoachByUserEmail(session.email);
    const coreConfig: CoreConfig =
      await this.coreConfigService.getDefaultDaysAsRecientCoacheeAssigned();
    const daysAgo = parseInt(coreConfig.value, 10);
    return this.historicalAssigmentRepository.getHistoricalAssigmentByCoachId(
      coach.id,
      daysAgo,
    );
  }

  async getCoachDashboardData(session: UserSession) {
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
      coacheesWithoutRecentActivity: null,
      //await this.getCoacheesWithoutRecentActivity(),
      coacheesRecentlyRegistered: null,
      //await this.getCoacheesRecentlyRegistered(),
    };
  }

  private async getInServiceCoaches(exclude?: number[]): Promise<Coach[]> {
    return this.repository.getInServiceCoaches(exclude);
  }

  private async getCoachByUserEmail(email: string): Promise<Coach> {
    return this.repository.getCoachByUserEmail(email);
  }

  async getCoacheesWithUpcomingAppointments(
    coachId: number,
  ): Promise<Coachee[]> {
    const coachAppointments: CoachAppointment[] =
      await this.coachAppointmentService.getCoachAppointmentsByCoachId(coachId);
    const coacheeIds: number[] = coachAppointments.map(
      (coachAppointment) => coachAppointment.coachee.id,
    );
    const result: Coachee[] = [];
    coacheeIds.forEach(async (id) => {
      const coachee: Coachee = await this.coacheeService.findOne(id);
      result.push(coachee);
    });
    return result;
  }
  // getCoacheesWithoutRecentActivity() {}
  // getCoacheesRecentlyRegistered() {}
}
