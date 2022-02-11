import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';

@EntityRepository(PostProgress)
export class PostProgressRepository extends BaseRepository<PostProgress> {
  getQueryBuilder(): SelectQueryBuilder<PostProgress> {
    return this.repository
      .createQueryBuilder('postProgress')
      .leftJoinAndSelect('postProgress.user', 'user');
  }

  getUserPostsProgress(userId: number): Promise<PostProgress[]> {
    return this.getQueryBuilder()
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
