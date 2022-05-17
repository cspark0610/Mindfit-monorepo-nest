import { forwardRef, Inject, Type, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { QueryRelations } from 'src/common/decorators/queryRelations.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { PUB_SUB } from 'src/pubSub/pubSub.module';
import { MessageDto } from 'src/subscriptions/dto/message.dto';
import { MessageReadByDto } from 'src/subscriptions/dto/messageReadBy.dto';
import { UpdateMessageDto } from 'src/subscriptions/dto/updateMessage.dto';
import { Subscriptions } from 'src/subscriptions/enums/subscriptions.enum';
import { Message } from 'src/subscriptions/models/message.model';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { MessagesService } from 'src/subscriptions/services/messages.service';
import { Roles } from 'src/users/enums/roles.enum';

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
      @QueryRelations('chat') relations: QueryRelationsType,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants({ chatId: data.chatId, relations }),
        this.messagesService.sendMessage({
          userId: session.userId,
          data,
          relations,
        }),
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
      @QueryRelations('message') relations: QueryRelationsType,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants({ chatId, relations }),
        this.messagesService.addUserRead(data),
      ]);
      await this.pubSub.publish(Subscriptions.COACHING_MESSAGES, {
        message,
        session,
        participants: chat.users,
      });
      return message;
    }

    @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
    @Mutation(() => classRef, { name: `update${context}Message` })
    protected async updateMessage(
      @CurrentSession() session: UserSession,
      @Args('chatId', { type: () => Number }) chatId: number,
      @Args('messageId', { type: () => Number }) messageId: number,
      @Args('data', { type: () => UpdateMessageDto }) data: UpdateMessageDto,
      @QueryRelations('message') relations: QueryRelationsType,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants({ chatId, relations }),
        this.messagesService.update(messageId, { message: data.message }),
      ]);
      await this.pubSub.publish(Subscriptions.COACHING_MESSAGES, {
        message,
        session,
        participants: chat.users,
      });
      return message;
    }

    @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
    @Mutation(() => classRef, { name: `delete${context}Message` })
    protected async deleteMessage(
      @CurrentSession() session: UserSession,
      @Args('chatId', { type: () => Number }) chatId: number,
      @Args('messageId', { type: () => Number }) messageId: number,
      @QueryRelations('message') relations: QueryRelationsType,
    ): Promise<Message> {
      const [chat, message] = await Promise.all([
        this.chatsService.getParticipants({ chatId, relations }),
        this.messagesService.findOneBy({ where: { id: messageId }, relations }),
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
