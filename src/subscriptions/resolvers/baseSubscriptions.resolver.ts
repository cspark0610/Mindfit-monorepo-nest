import { forwardRef, Inject, Type } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { PUB_SUB } from 'src/pubSub/pubSub.module';
import { MessageDto } from 'src/subscriptions/dto/message.dto';
import { MessageReadByDto } from 'src/subscriptions/dto/messageReadBy.dto';
import { UpdateMessageDto } from 'src/subscriptions/dto/updateMessage.dto';
import { Subscriptions } from 'src/subscriptions/enums/subscriptions.enum';
import { Message } from 'src/subscriptions/models/message.model';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { MessagesService } from 'src/subscriptions/services/messages.service';

export function BaseSubscriptionsResolver<T extends Type<unknown>>(
  classRef: T,
  context: string,
): any {
  @Resolver({ isAbstract: true })
  abstract class BaseSubscriptionsResolverHost {
    constructor(
      @Inject(PUB_SUB) private pubSub: PubSub,
      @Inject(forwardRef(() => MessagesService))
      private messagesService: MessagesService,
      @Inject(forwardRef(() => ChatsService))
      private chatsService: ChatsService,
    ) {}

    @Mutation(() => classRef, { name: `send${context}Messages` })
    protected async sendMessage(
      @CurrentSession() session: UserSession,
      @Args('data', { type: () => MessageDto }) data: MessageDto,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants(data.chatId),
        this.messagesService.sendMessage(session.userId, data),
      ]);
      await this.pubSub.publish(Subscriptions.COACHING_MESSAGES, {
        message,
        session,
        participants: chat.users,
      });
      return message;
    }

    @Mutation(() => classRef, { name: `addUserReadTo${context}Message` })
    protected async addUserRead(
      @CurrentSession() session: UserSession,
      @Args('chatId', { type: () => Number }) chatId: number,
      @Args('data', { type: () => MessageReadByDto }) data: MessageReadByDto,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants(chatId),
        this.messagesService.addUserRead(data),
      ]);
      await this.pubSub.publish(Subscriptions.COACHING_MESSAGES, {
        message,
        session,
        participants: chat.users,
      });
      return message;
    }

    @Mutation(() => classRef, { name: `update${context}Message` })
    protected async updateMessage(
      @CurrentSession() session: UserSession,
      @Args('chatId', { type: () => Number }) chatId: number,
      @Args('messageId', { type: () => Number }) messageId: number,
      @Args('data', { type: () => UpdateMessageDto }) data: UpdateMessageDto,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants(chatId),
        this.messagesService.update(messageId, { message: data.message }),
      ]);
      await this.pubSub.publish(Subscriptions.COACHING_MESSAGES, {
        message,
        session,
        participants: chat.users,
      });
      return message;
    }

    @Mutation(() => classRef, { name: `delete${context}Message` })
    protected async deleteMessage(
      @CurrentSession() session: UserSession,
      @Args('chatId', { type: () => Number }) chatId: number,
      @Args('messageId', { type: () => Number }) messageId: number,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants(chatId),
        this.messagesService.findOneBy({ id: messageId }),
      ]);

      await Promise.all([
        this.messagesService.delete(messageId),
        this.pubSub.publish(Subscriptions.COACHING_MESSAGES, {
          message,
          session,
          participants: chat.users,
        }),
      ]);

      return message;
    }
  }

  return BaseSubscriptionsResolverHost;
}
