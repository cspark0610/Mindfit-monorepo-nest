import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { HistoricalAssigmentRepository } from 'src/coaching/repositories/historicalAssigment.repository';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CreateHistoricalAssigmentDto } from 'src/coaching/dto/historicalAssigment.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';

@Injectable()
export class HistoricalAssigmentService extends BaseService<HistoricalAssigment> {
  constructor(
    private historicalAssigmentRepository: HistoricalAssigmentRepository,
    private coreConfigService: CoreConfigService,
    private coachRepository: CoachRepository,
    private coacheeRepository: CoacheeRepository,
  ) {
    super();
  }

  async getAllHistoricalAssigmentsByCoachId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const coach: Coach = await this.coachRepository.getCoachByUserEmail(
      session.email,
    );

    return this.historicalAssigmentRepository.getAllHistoricalAssigmentsByCoachId(
      coach.id,
    );
  }

  async getAllHistoricalAssigmentsByCoacheeId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const coachee: Coachee = await this.coacheeRepository.getCoacheeByUserEmail(
      session.email,
    );
    return this.historicalAssigmentRepository.getAllHistoricalAssigmentsByCoacheeId(
      coachee.id,
    );
  }

  async getRecentHistoricalAssigmentByCoachId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const coach: Coach = await this.coachRepository.getCoachByUserEmail(
      session.email,
    );

    const daysAgo: number =
      await this.coreConfigService.getDefaultDaysAsRecentCoacheeAssigned();

    return this.historicalAssigmentRepository.getRecentHistoricalAssigmentByCoachId(
      coach.id,
      daysAgo,
    );
  }

  async create(
    data: CreateHistoricalAssigmentDto,
  ): Promise<HistoricalAssigment> {
    return this.historicalAssigmentRepository.create(data);
  }

  async relationHistoricalAssigmentWithCoach(
    historicalAssigment: HistoricalAssigment,
    coach: Coach,
  ): Promise<void> {
    return this.historicalAssigmentRepository.relationHistoricalAssigmentWithCoach(
      historicalAssigment,
      coach,
    );
  }

  async relationHistoricalAssigmentWithCoachee(
    historicalAssigment: HistoricalAssigment,
    coachee: Coachee,
  ): Promise<void> {
    return this.historicalAssigmentRepository.relationHistoricalAssigmentWithCoachee(
      historicalAssigment,
      coachee,
    );
  }
}
