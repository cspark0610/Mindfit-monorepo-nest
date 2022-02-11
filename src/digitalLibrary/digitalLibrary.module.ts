import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';
import { FavoritePostRepository } from 'src/digitalLibrary/repositories/favoritePost.repository';
import { PostProgressRepository } from 'src/digitalLibrary/repositories/postProgress.repository';
import { FavoritePostsResolver } from 'src/digitalLibrary/resolvers/favoritePosts.resolver';
import { PostsProgressResolver } from 'src/digitalLibrary/resolvers/postsProgress.resolver';
import { FavoritePostsService } from 'src/digitalLibrary/services/favoritePosts.service';
import { PostsProgressService } from 'src/digitalLibrary/services/postsProgress.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoritePost,
      PostProgress,
      FavoritePostRepository,
      PostProgressRepository,
    ]),
  ],
  providers: [
    FavoritePostsResolver,
    PostsProgressResolver,
    FavoritePostsService,
    PostsProgressService,
  ],
})
export class DigitalLibraryModule {}
