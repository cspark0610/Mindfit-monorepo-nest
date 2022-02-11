import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';
import { FavoritePostRepository } from 'src/digitalLibrary/repositories/favoritePost.repository';

@Injectable()
export class FavoritePostsService extends BaseService<FavoritePost> {
  constructor(protected readonly repository: FavoritePostRepository) {
    super();
  }

  getUserFavoritePosts(userId: number): Promise<FavoritePost[]> {
    return this.repository.getUserFavoritePosts(userId);
  }
}
