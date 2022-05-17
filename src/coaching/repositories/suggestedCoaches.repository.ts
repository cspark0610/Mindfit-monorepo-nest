import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(SuggestedCoaches)
export class SuggestedCoachesRepository extends BaseRepository<SuggestedCoaches> {
  getQueryBuilder(
    relations: QueryRelationsType = {
      ref: 'suggestedCoaches',
      relations: [],
    },
  ): SelectQueryBuilder<SuggestedCoaches> {
    return super.getQueryBuilder(relations);
  }

  getLastNonRejectedSuggestion({
    coacheeId,
    relations,
  }: {
    coacheeId: number;
    relations?: QueryRelationsType;
  }): Promise<SuggestedCoaches> {
    return this.getQueryBuilder(relations)
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere('suggestedCoaches.rejected = false')
      .orderBy('suggestedCoaches.createdAt', 'DESC')
      .getOne();
  }

  getAllRejectedSuggestion({
    coacheeId,
    relations,
  }: {
    coacheeId: number;
    relations?: QueryRelationsType;
  }): Promise<SuggestedCoaches[]> {
    return this.getQueryBuilder(relations)
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere('suggestedCoaches.rejected = TRUE')
      .orderBy('suggestedCoaches.createdAt', 'DESC')
      .getMany();
  }
}
