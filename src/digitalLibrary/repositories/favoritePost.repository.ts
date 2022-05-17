import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(FavoritePost)
export class FavoritePostRepository extends BaseRepository<FavoritePost> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'favoritePost', relations: [] },
  ): SelectQueryBuilder<FavoritePost> {
    return super.getQueryBuilder(relations);
  }

  getUserFavoritePosts({
    userId,
    relations,
  }: {
    userId: number;
    relations?: QueryRelationsType;
  }): Promise<FavoritePost[]> {
    return this.getQueryBuilder(relations)
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
