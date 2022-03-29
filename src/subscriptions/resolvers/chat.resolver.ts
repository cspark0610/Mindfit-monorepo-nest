import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { JoinChatDto } from 'src/subscriptions/dto/joinChat.dto';
import { Chat } from 'src/subscriptions/models/chat.model';
import { ChatsService } from 'src/subscriptions/services/chats.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ChatResolver {
  constructor(private chatsService: ChatsService) {}

  @Query(() => Chat)
  getChat(
    @Args('chatId', { type: () => Number }) chatId: number,
  ): Promise<Chat> {
    return this.chatsService.getChat(chatId);
  }

  @Mutation(() => Chat)
  createChat(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => JoinChatDto }) data: JoinChatDto,
  ): Promise<Chat> {
    return this.chatsService.createChat({
      userIds: [session.userId, ...data.userIds],
    });
  }

  @Mutation(() => Chat)
  joinToChat(
    @Args('chatId', { type: () => Number }) chatId: number,
    @Args('data', { type: () => JoinChatDto }) data: JoinChatDto,
  ): Promise<Chat> {
    return this.chatsService.joinToChat(chatId, data);
  }

  @Mutation(() => Chat)
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
