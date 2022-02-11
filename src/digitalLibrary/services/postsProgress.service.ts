import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';
import { PostProgressRepository } from 'src/digitalLibrary/repositories/postProgress.repository';

@Injectable()
export class PostsProgressService extends BaseService<PostProgress> {
  constructor(protected readonly repository: PostProgressRepository) {
    super();
  }

  getUserPostsProgress(userId: number): Promise<PostProgress[]> {
    return this.repository.getUserPostsProgress(userId);
  }
}
