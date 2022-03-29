import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/subscriptions/models/chat.model';
import { Message } from 'src/subscriptions/models/message.model';
import { ChatRepository } from 'src/subscriptions/repositories/chat.repository';
import { MessageRepository } from 'src/subscriptions/repositories/message.repository';
import { ChatResolver } from 'src/subscriptions/resolvers/chat.resolver';
import { CoachingSubscriptionResolver } from 'src/subscriptions/resolvers/coachingSubscriptions.resolver';
import { MessagesResolver } from 'src/subscriptions/resolvers/messages.resolver';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { MessagesService } from 'src/subscriptions/services/messages.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      Message,
      MessageRepository,
      ChatRepository,
    ]),
    UsersModule,
  ],
  providers: [
    ChatResolver,
    MessagesResolver,
    CoachingSubscriptionResolver,
    ChatsService,
    MessagesService,
  ],
})
export class ChatsModule {}
