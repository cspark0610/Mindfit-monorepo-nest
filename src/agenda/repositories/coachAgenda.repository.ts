import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(CoachAgenda)
export class CoachAgendaRepository extends BaseRepository<CoachAgenda> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'coachAgenda',
      relations: [],
    },
  ): SelectQueryBuilder<CoachAgenda> {
    return super.getQueryBuilder(relations);
  }
}
