import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';
import { PostProgressRepository } from 'src/digitalLibrary/repositories/postProgress.repository';

@Injectable()
export class PostsProgressService extends BaseService<PostProgress> {
  constructor(protected readonly repository: PostProgressRepository) {
    super();
  }

  getUserPostsProgress({
    userId,
    relations,
  }: {
    userId: number;
    relations?: QueryRelationsType;
  }): Promise<PostProgress[]> {
    return this.repository.getUserPostsProgress({ userId, relations });
  }
}
