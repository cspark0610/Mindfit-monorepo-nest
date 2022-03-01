import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { HistoricalAssigmentRepository } from 'src/coaching/repositories/historicalAssigment.repository';
import { UsersService } from 'src/users/services/users.service';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { User } from 'src/users/models/users.model';

@Injectable()
export class HistoricalAssigmentService extends BaseService<HistoricalAssigment> {
  constructor(
    private historicalAssigmentRepository: HistoricalAssigmentRepository,
    private usersService: UsersService,
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
}
