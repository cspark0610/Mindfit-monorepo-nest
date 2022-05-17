import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { QueryRelations } from 'src/common/decorators/queryRelations.decorator';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { FavoritePostDto } from 'src/digitalLibrary/dto/favoritePost.dto';
import { UpdateFavoritePostDto } from 'src/digitalLibrary/dto/updateFavoritePost.dto';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';
import { FavoritePostsService } from 'src/digitalLibrary/services/favoritePosts.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => FavoritePost)
export class FavoritePostsResolver extends BaseResolver(FavoritePost, {
  create: FavoritePostDto,
  update: UpdateFavoritePostDto,
}) {
  constructor(protected readonly service: FavoritePostsService) {
    super();
  }

  @Query(() => [FavoritePost], { name: `findAllFavoritePosts` })
  async findAll(
    @CurrentSession() session: UserSession,
    @QueryRelations('favoritePost') relations: QueryRelationsType,
  ): Promise<FavoritePost[]> {
    return this.service.getUserFavoritePosts({
      userId: session.userId,
      relations,
    });
  }

  @Mutation(() => FavoritePost, { name: `createFavoritePost` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => FavoritePostDto }) data: FavoritePostDto,
  ): Promise<FavoritePost> {
    return this.service.create(
      await FavoritePostDto.from(data, session.userId),
    );
  }

  @Mutation(() => [FavoritePost], { name: `createManyFavoritePost` })
  async createMany(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => [FavoritePostDto] }) data: FavoritePostDto[],
  ): Promise<FavoritePost[]> {
    return this.service.createMany(
      await Promise.all(
        data.map((item) => FavoritePostDto.from(item, session.userId)),
      ),
    );
  }
}
