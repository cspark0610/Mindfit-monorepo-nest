import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import dayjs from 'dayjs';

@EntityRepository(CoachAgendaDay)
export class CoachAgendaDayRepository extends BaseRepository<CoachAgendaDay> {
  getQueryBuilder(): SelectQueryBuilder<CoachAgendaDay> {
    return this.repository
      .createQueryBuilder('coachAgendaDay')
      .leftJoinAndSelect('coachAgendaDay.coachAgenda', 'coachAgenda');
  }

  getCoachAgendaDaysBetweenDates({
    coachAgendaId,
    from,
    to,
  }: {
    coachAgendaId: number;
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
  }): Promise<CoachAgendaDay[]> {
    return this.getQueryBuilder()
      .where('coachAgenda.id = :coachAgendaId', {
        coachAgendaId,
      })
      .andWhere('coachAgendaDay.day BETWEEN :from AND :to', { from, to })
      .getMany();
  }
}
