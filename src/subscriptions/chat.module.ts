import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/subscriptions/models/chat.model';
import { Message } from 'src/subscriptions/models/message.model';
import { ChatRepository } from 'src/subscriptions/repositories/chat.repository';
import { MessageRepository } from 'src/subscriptions/repositories/message.repository';
import { CoachingChatResolver } from 'src/subscriptions/resolvers/coachingChat.resolver';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { MessagesService } from 'src/subscriptions/services/messages.service';
import { UsersModule } from 'src/users/users.module';
import { CoachingSubscriptionValidator } from 'src/subscriptions/validators/coachingSubscriptions.validator';
import { CoachingModule } from 'src/coaching/coaching.module';
import { CoachingSubscriptionResolver } from 'src/subscriptions/resolvers/coachingSubscriptions.resolver';
import { CoachingMessagesResolver } from 'src/subscriptions/resolvers/coachingMessages.resolver';
import { CoachingChatValidator } from 'src/subscriptions/validators/coachingChat.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      Message,
      MessageRepository,
      ChatRepository,
    ]),
    UsersModule,
    CoachingModule,
  ],
  providers: [
    CoachingChatResolver,
    ChatsService,
    MessagesService,
    CoachingSubscriptionResolver,
    CoachingMessagesResolver,
    CoachingSubscriptionValidator,
    CoachingChatValidator,
  ],
})
export class ChatsModule {}
