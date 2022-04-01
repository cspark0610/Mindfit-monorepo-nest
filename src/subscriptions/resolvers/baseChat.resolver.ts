import { Type, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JoinChatDto } from 'src/subscriptions/dto/joinChat.dto';
import { Chat } from 'src/subscriptions/models/chat.model';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { Roles } from 'src/users/enums/roles.enum';

export function BaseChatResolver<T extends Type<unknown>>(
  classRef: T,
  context: string,
): any {
  @Resolver({ isAbstract: true })
  abstract class BaseChatResolverHost {
    constructor(private chatsService: ChatsService) {}

    @Query(() => classRef, { name: `get${context}Chat` })
    getChat(
      @Args('chatId', { type: () => Number }) chatId: number,
    ): Promise<Chat> {
      return this.chatsService.getChat(chatId);
    }

    @Mutation(() => classRef, { name: `create${context}Chat` })
    createChat(
      @CurrentSession() session: UserSession,
      @Args('data', { type: () => JoinChatDto }) data: JoinChatDto,
    ): Promise<Chat> {
      return this.chatsService.createChat({
        userIds: [session.userId, ...data.userIds],
      });
    }

    @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
    @Mutation(() => classRef, { name: `joinTo${context}Chat` })
    joinToChat(
      @Args('chatId', { type: () => Number }) chatId: number,
      @Args('data', { type: () => JoinChatDto }) data: JoinChatDto,
    ): Promise<Chat> {
      return this.chatsService.joinToChat(chatId, data);
    }

    @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
    @Mutation(() => classRef, { name: `removeFrom${context}Chat` })
    removeUsersFromChat(
      @Args('chatId', { type: () => Number }) chatId: number,
      @Args('data', { type: () => JoinChatDto }) { userIds }: JoinChatDto,
    ): Promise<Chat> {
      return this.chatsService.removeUsersFromChat({
        chatId,
        userIds,
      });
    }
  }

  return BaseChatResolverHost;
}
