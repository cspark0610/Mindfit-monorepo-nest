import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import dayjs from 'dayjs';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachAgendaDay)
export class CoachAgendaDayRepository extends BaseRepository<CoachAgendaDay> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'coachAgendaDay',
      relations: [],
    },
  ): SelectQueryBuilder<CoachAgendaDay> {
    return super.getQueryBuilder(relations);
  }

  getCoachAgendaDaysBetweenDates({
    coachAgendaId,
    from,
    to,
    relations,
  }: {
    coachAgendaId: number;
    from: dayjs.Dayjs;
    to: dayjs.Dayjs;
    relations?: QueryRelationsType;
  }): Promise<CoachAgendaDay[]> {
    return this.getQueryBuilder(relations)
      .where('coachAgenda.id = :coachAgendaId', {
        coachAgendaId,
      })
      .andWhere('coachAgendaDay.day BETWEEN :from AND :to', { from, to })
      .getMany();
  }
}
