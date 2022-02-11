import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { PostProgressDto } from 'src/digitalLibrary/dto/postProgress.dto';
import { UpdatePostProgressDto } from 'src/digitalLibrary/dto/updatePostProgress.dto';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';
import { PostsProgressService } from 'src/digitalLibrary/services/postsProgress.service';

@UseGuards(JwtAuthGuard)
@Resolver(() => PostProgress)
export class PostsProgressResolver extends BaseResolver(PostProgress, {
  create: PostProgressDto,
  update: UpdatePostProgressDto,
}) {
  constructor(protected readonly service: PostsProgressService) {
    super();
  }

  @Query(() => [PostProgress], { name: `findAllPostProgresss` })
  protected async findAll(
    @CurrentSession() session: UserSession,
  ): Promise<PostProgress[]> {
    return this.service.getUserPostsProgress(session.userId);
  }

  @Mutation(() => PostProgress, { name: `createPostProgress` })
  protected async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => PostProgressDto }) data: PostProgressDto,
  ): Promise<PostProgress> {
    return this.service.create(
      await PostProgressDto.from(data, session.userId),
    );
  }

  @Mutation(() => [PostProgress], { name: `createManyPostProgress` })
  protected async createMany(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => [PostProgressDto] }) data: PostProgressDto[],
  ): Promise<PostProgress[]> {
    return this.service.createMany(
      await Promise.all(
        data.map((item) => PostProgressDto.from(item, session.userId)),
      ),
    );
  }
}
