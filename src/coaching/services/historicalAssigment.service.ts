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
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

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

  async getAllHistoricalAssigmentsByCoachId({
    session,
    relations,
  }: {
    session: UserSession;
    relations?: QueryRelationsType;
  }): Promise<HistoricalAssigment[]> {
    const coach: Coach = await this.coachRepository.getCoachByUserEmail({
      email: session.email,
      relations,
    });

    return this.repository.getAllHistoricalAssigmentsByCoachId({
      coachId: coach.id,
      relations,
    });
  }

  async getAllHistoricalAssigmentsByCoacheeId({
    session,
    relations,
  }: {
    session: UserSession;
    relations?: QueryRelationsType;
  }): Promise<HistoricalAssigment[]> {
    const coachee: Coachee = await this.coacheeRepository.getCoacheeByUserEmail(
      {
        email: session.email,
        relations,
      },
    );
    return this.repository.getAllHistoricalAssigmentsByCoacheeId({
      coacheeId: coachee.id,
      relations,
    });
  }

  async getRecentHistoricalAssigmentByCoachId({
    session,
    relations,
  }: {
    session: UserSession;
    relations?: QueryRelationsType;
  }): Promise<HistoricalAssigment[]> {
    const coach: Coach = await this.coachRepository.getCoachByUserEmail({
      email: session.email,
      relations,
    });

    const daysAgo: number =
      await this.coreConfigService.getDefaultDaysAsRecentCoacheeAssigned();

    return this.repository.getRecentHistoricalAssigmentByCoachId({
      coachId: coach.id,
      daysAgo,
      relations,
    });
  }
}
