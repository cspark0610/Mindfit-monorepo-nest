import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';

const POSSIBLE_JOINS_FIELDS = [
  'user',
  'coachApplication',
  'coachAgenda',
  'coachingAreas',
  'assignedCoachees',
  'coachNotes',
  'coachingSessions',
  'coacheeEvaluations',
  'historicalAssigments',
];
@EntityRepository(Coach)
export class CoachRepository extends BaseRepository<Coach> {
  getDinamicQueryBuilder(fieldsArr: string[]): SelectQueryBuilder<Coach> {
    const filtered = POSSIBLE_JOINS_FIELDS.filter((field) =>
      fieldsArr.includes(field),
    );
    const created = this.repository.createQueryBuilder('coach');
    filtered.forEach((field) => {
      created.leftJoinAndSelect(`coach.${field}`, field);
    });
    return created;
  }

  getQueryBuilder(): SelectQueryBuilder<Coach> {
    return this.repository
      .createQueryBuilder('coach')
      .leftJoinAndSelect('coach.user', 'user')
      .leftJoinAndSelect('coach.coachApplication', 'coachApplication')
      .leftJoinAndSelect('coach.coachAgenda', 'coachAgenda')
      .leftJoinAndSelect('coach.coachingAreas', 'coachingAreas')
      .leftJoinAndSelect('coach.assignedCoachees', 'assignedCoachees')
      .leftJoinAndSelect(
        'assignedCoachees.coachAppointments',
        'assignedCoacheesAppointments',
      )
      .leftJoinAndSelect(
        'assignedCoacheesAppointments.coachingSession',
        'assignedCoacheesAppointmentsSessions',
      )
      .leftJoinAndSelect('assignedCoachees.user', 'assignedCoacheesUsers')
      .leftJoinAndSelect(
        'assignedCoachees.organization',
        'assignedCoacheesOrganization',
      )
      .leftJoinAndSelect('coach.coachNotes', 'coachNotes')
      .leftJoinAndSelect('coach.coachingSessions', 'coachingSessions')
      .leftJoinAndSelect('coach.coacheeEvaluations', 'coacheeEvaluations')
      .leftJoinAndSelect('coach.historicalAssigments', 'historicalAssigment');
  }

  async update(id: number, data: Partial<Coach>): Promise<Coach> {
    let coach = await this.findOneBy({ id });
    coach = { ...coach, ...data };
    return this.repository.save(coach as any);
  }

  getCoachByUserEmail(email: string): Promise<Coach> {
    return this.getQueryBuilder()
      .where('user.email = :email', { email })
      .getOne();
  }

  getDinamicCoachByUserEmail(
    email: string,
    fieldsArr: string[],
  ): Promise<Coach> {
    return this.getDinamicQueryBuilder(fieldsArr)
      .where('user.email = :email', { email })
      .getOne();
  }

  getInServiceCoaches(exclude: number[] = []): Promise<Coach[]> {
    const query = this.getQueryBuilder().where(
      'coachAgenda.outOfService = FALSE',
    );
    if (exclude.length > 0)
      query.andWhere('coach.id NOT IN (:...exclude)', { exclude });
    return query.getMany();
  }

  getHistoricalAsigmentOfCoachByCoachId(
    coachId: number,
    daysAgo: number,
  ): Promise<Coach> {
    const defaultDaysAgo = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return this.getQueryBuilder()
      .where(
        'historicalAssigment.assigmentDate BETWEEN :defaultDaysAgo AND CURRENT_DATE',
        { defaultDaysAgo },
      )
      .andWhere('coach.id = :coachId', { coachId })
      .getOne();
  }

  assignCoachingAreasToCoach(
    coach: Coach,
    coachingAreas: CoachingArea[],
  ): Promise<Coach> {
    coach.coachingAreas = coachingAreas;
    return this.repository.save(coach);
  }
}
