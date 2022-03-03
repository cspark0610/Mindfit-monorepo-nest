import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { Organization } from 'src/organizations/models/organization.model';

@EntityRepository(Coachee)
export class CoacheeRepository extends BaseRepository<Coachee> {
  getQueryBuilder(): SelectQueryBuilder<Coachee> {
    return this.repository
      .createQueryBuilder('coachee')
      .leftJoinAndSelect('coachee.user', 'user')
      .leftJoinAndSelect('coachee.organization', 'organization')
      .leftJoinAndSelect('coachee.assignedCoach', 'assignedCoach')
      .leftJoinAndSelect('assignedCoach.user', 'coachUser')
      .leftJoinAndSelect('coachee.suggestedCoaches', 'suggestedCoaches')
      .leftJoinAndSelect('coachee.coachingAreas', 'coachingAreas')
      .leftJoinAndSelect('coachee.coachAppointments', 'coachAppointments')
      .leftJoinAndSelect('coachee.coachNotes', 'coachNotes')
      .leftJoinAndSelect('coachee.coachingSessions', 'coachingSessions')
      .leftJoinAndSelect('coachee.coacheeEvaluations', 'coacheeEvaluations')
      .leftJoinAndSelect(
        'coachee.historicalAssigments',
        'historicalAssigments',
      );
  }
  async getCoacheesWithUpcomingAppointmentsByCoachId(coachId: number) {
    return this.getQueryBuilder()
      .leftJoin('coachAppointments.coachAgenda', 'coachAgenda')
      .leftJoin('coachAgenda.coach', 'coach')
      .where('coach.id = :coachId', { coachId })
      .getMany();
  }

  relationCoacheeWithOrganization(
    coachee: Coachee,
    organization: Organization,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(Coachee, 'organization')
      .of(coachee)
      .set(organization); // as we are using a ManyToOne relation
  }

  getCoacheesRecentlyRegistered(
    daysRecentRegistered: number,
  ): Promise<Coachee[]> {
    const daysAgo = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * daysRecentRegistered,
    );
    return this.getQueryBuilder()
      .where('user.role = :role', { role: 'COACHEE' })
      .andWhere('user.createdAt BETWEEN :daysAgo AND CURRENT_DATE', {
        daysAgo,
      })
      .getMany();
  }

  getCoacheesWithoutRecentActivity(
    daysWithoutActivity: number,
  ): Promise<Coachee[]> {
    const daysAgo = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * daysWithoutActivity,
    );
    return this.getQueryBuilder()
      .where('user.role = :role', { role: 'COACHEE' })
      .andWhere('user.lastLoggedIn < :daysAgo', { daysAgo })
      .getMany();
  }

  getCoacheeByUserEmail(email: string): Promise<Coachee> {
    return this.getQueryBuilder()
      .where('user.email = :email', { email })
      .getOne();
  }
  findCoacheesByCoachId(coachId: number): Promise<Coachee[]> {
    return this.getQueryBuilder()
      .where('assignedCoach.id = :coachId', { coachId })
      .getMany();
  }

  getHistoricalDataQueryBuilder(coachId: number): Promise<Coachee[]> {
    return this.getQueryBuilder()
      .where('coachAppointments.endDate < CURRENT_DATE')
      .andWhere('assignedCoach.id = :coachId', { coachId })
      .getMany();
  }
  assignCoachingAreas(coachee: Coachee, coachingAreas: CoachingArea[]) {
    coachee.coachingAreas = coachingAreas;
    return this.repository.save(coachee);
  }
}
