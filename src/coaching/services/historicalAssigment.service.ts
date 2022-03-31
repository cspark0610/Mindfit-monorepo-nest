import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { HistoricalAssigmentRepository } from 'src/coaching/repositories/historicalAssigment.repository';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';

@Injectable()
export class HistoricalAssigmentService extends BaseService<HistoricalAssigment> {
  constructor(
    // se debe sobreescribir el repository para que tome los metodos del crud
    protected readonly repository: HistoricalAssigmentRepository,
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

    return this.repository.getAllHistoricalAssigmentsByCoachId(coach.id);
  }

  async getAllHistoricalAssigmentsByCoacheeId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const coachee: Coachee = await this.coacheeRepository.getCoacheeByUserEmail(
      session.email,
    );
    return this.repository.getAllHistoricalAssigmentsByCoacheeId(coachee.id);
  }

  async getRecentHistoricalAssigmentByCoachId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const coach: Coach = await this.coachRepository.getCoachByUserEmail(
      session.email,
    );

    const daysAgo: number =
      await this.coreConfigService.getDefaultDaysAsRecentCoacheeAssigned();

    return this.repository.getRecentHistoricalAssigmentByCoachId(
      coach.id,
      daysAgo,
    );
  }
}
