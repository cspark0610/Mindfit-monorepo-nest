import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { Roles } from 'src/users/enums/roles.enum';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(Coachee)
export class CoacheeRepository extends BaseRepository<Coachee> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'coachee', relations: [] },
  ): SelectQueryBuilder<Coachee> {
    return super.getQueryBuilder(relations);
  }

  async getCoacheesWithUpcomingAppointmentsByCoachId({
    coachId,
    relations,
  }: {
    coachId: number;
    relations?: QueryRelationsType;
  }): Promise<Coachee[]> {
    return this.getQueryBuilder(relations)
      .leftJoin('coachAppointments.coachAgenda', 'coachAgenda')
      .leftJoin('coachAgenda.coach', 'coach')
      .where('coach.id = :coachId', { coachId })
      .andWhere('coachAppointments.startDate > CURRENT_DATE')
      .getMany();
  }

  getCoacheesRecentlyRegistered({
    daysRecentRegistered,
    coachId,
    relations,
  }: {
    daysRecentRegistered: number;
    coachId: number;
    relations?: QueryRelationsType;
  }): Promise<Coachee[]> {
    const daysAgo = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * daysRecentRegistered,
    );
    return this.getQueryBuilder(relations)
      .where('user.role = :role', { role: Roles.COACHEE })
      .andWhere('user.createdAt BETWEEN :daysAgo AND CURRENT_TIMESTAMP', {
        daysAgo,
      })
      .andWhere('assignedCoach.id = :coachId', { coachId })
      .getMany();
  }

  getCoacheesWithoutRecentActivity({
    daysWithoutActivity,
    coachId,
    relations,
  }: {
    daysWithoutActivity: number;
    coachId: number;
    relations?: QueryRelationsType;
  }): Promise<Coachee[]> {
    const daysAgo = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * daysWithoutActivity,
    );
    return this.getQueryBuilder(relations)
      .where('user.role = :role', { role: Roles.COACHEE })
      .andWhere('user.lastLoggedIn < :daysAgo', { daysAgo })
      .andWhere('assignedCoach.id = :coachId', { coachId })
      .getMany();
  }

  getCoacheeByUserEmail({
    email,
    relations,
  }: {
    email: string;
    relations?: QueryRelationsType;
  }): Promise<Coachee> {
    return this.getQueryBuilder(relations)
      .where('user.email = :email', { email })
      .getOne();
  }

  findCoacheesByCoachId({
    coachId,
    relations,
  }: {
    coachId: number;
    relations?: QueryRelationsType;
  }): Promise<Coachee[]> {
    return this.getQueryBuilder(relations)
      .where('assignedCoach.id = :coachId', { coachId })
      .getMany();
  }

  getHistoricalDataQueryBuilder({
    coachId,
    relations,
  }: {
    coachId: number;
    relations?: QueryRelationsType;
  }): Promise<Coachee[]> {
    return this.getQueryBuilder(relations)
      .where('coachAppointments.endDate < CURRENT_DATE')
      .andWhere('assignedCoach.id = :coachId', { coachId })
      .getMany();
  }

  assignCoachingAreas({
    coachee,
    coachingAreas,
  }: {
    coachee: Coachee;
    coachingAreas: CoachingArea[];
  }) {
    coachee.coachingAreas = coachingAreas;
    return this.repository.save(coachee);
  }
}
