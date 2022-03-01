import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { HistoricalAssigmentRepository } from 'src/coaching/repositories/historicalAssigment.repository';
import { UsersService } from 'src/users/services/users.service';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { User } from 'src/users/models/users.model';
import { CreateHistoricalAssigmentDto } from 'src/coaching/dto/historicalAssigment.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';

@Injectable()
export class HistoricalAssigmentService extends BaseService<HistoricalAssigment> {
  constructor(
    private historicalAssigmentRepository: HistoricalAssigmentRepository,
    private usersService: UsersService,
    private coreConfigService: CoreConfigService,
  ) {
    super();
  }

  async getAllHistoricalAssigmentsByCoachId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    return this.historicalAssigmentRepository.getAllHistoricalAssigmentsByCoachId(
      hostUser.coach.id,
    );
  }

  async getAllHistoricalAssigmentsByCoacheeId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    return this.historicalAssigmentRepository.getAllHistoricalAssigmentsByCoacheeId(
      hostUser.coachee.id,
    );
  }

  async getRecentHistoricalAssigmentByCoachId(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const daysAgo: number =
      await this.coreConfigService.getDefaultDaysAsRecentCoacheeAssigned();

    return this.historicalAssigmentRepository.getRecentHistoricalAssigmentByCoachId(
      hostUser.coach.id,
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
