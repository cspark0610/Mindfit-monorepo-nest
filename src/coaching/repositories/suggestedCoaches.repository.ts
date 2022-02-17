import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { EntityRepository, SelectQueryBuilder } from 'typeorm';

@EntityRepository(SuggestedCoaches)
export class SuggestedCoachesRepository extends BaseRepository<SuggestedCoaches> {
  getQueryBuilder(): SelectQueryBuilder<SuggestedCoaches> {
    return this.repository
      .createQueryBuilder('suggestedCoaches')
      .leftJoinAndSelect('suggestedCoaches.coaches', 'coaches')
      .leftJoinAndSelect('coaches.user', 'coachesUsers')
      .leftJoinAndSelect('suggestedCoaches.coachee', 'coachee')
      .leftJoinAndSelect('coachee.user', 'coacheesUsers')
      .leftJoinAndSelect('suggestedCoaches.satReport', 'satReport');
  }

  getLastNonRejectedSuggestion(coacheeId: number): Promise<SuggestedCoaches> {
    return this.getQueryBuilder()
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere('suggestedCoaches.rejected = false')
      .orderBy('suggestedCoaches.createdAt', 'DESC')
      .getOne();
  }
  getAllRejectedSuggestion(coacheeId: number): Promise<SuggestedCoaches[]> {
    return this.getQueryBuilder()
      .where('coachee.id = :coacheeId', { coacheeId })
      .andWhere('suggestedCoaches.rejected = TRUE')
      .orderBy('suggestedCoaches.createdAt', 'DESC')
      .getMany();
  }
}
