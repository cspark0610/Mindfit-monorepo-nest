import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';

@EntityRepository(FavoritePost)
export class FavoritePostRepository extends BaseRepository<FavoritePost> {
  getQueryBuilder(): SelectQueryBuilder<FavoritePost> {
    return this.repository
      .createQueryBuilder('favoritePost')
      .leftJoinAndSelect('favoritePost.user', 'user');
  }

  getUserFavoritePosts(userId: number): Promise<FavoritePost[]> {
    return this.getQueryBuilder()
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
