import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(PostProgress)
export class PostProgressRepository extends BaseRepository<PostProgress> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'postProgress', relations: [] },
  ): SelectQueryBuilder<PostProgress> {
    return super.getQueryBuilder(relations);
  }

  getUserPostsProgress({
    userId,
    relations,
  }: {
    userId: number;
    relations?: QueryRelationsType;
  }): Promise<PostProgress[]> {
    return this.getQueryBuilder(relations)
      .where('user.id = :userId', { userId })
      .getMany();
  }
}
