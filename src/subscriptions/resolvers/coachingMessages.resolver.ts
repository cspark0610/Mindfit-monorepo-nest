import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PUB_SUB } from 'src/pubSub/pubSub.module';
import { CoachingSubscriptionValidatorGuard } from 'src/subscriptions/guards/coachingSubscriptionValidator.guard';
import { Message } from 'src/subscriptions/models/message.model';
import { BaseSubscriptionsResolver } from 'src/subscriptions/resolvers/baseSubscriptions.resolver';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { MessagesService } from 'src/subscriptions/services/messages.service';
import { Roles } from 'src/users/enums/roles.enum';

@Resolver()
@UseGuards(
  JwtAuthGuard,
  RolesGuard(
    Roles.COACH,
    Roles.COACHEE,
    Roles.COACHEE_ADMIN,
    Roles.COACHEE_OWNER,
    Roles.SUPER_USER,
  ),
  CoachingSubscriptionValidatorGuard,
)
export class CoachingMessagesResolver extends BaseSubscriptionsResolver(
  Message,
  'Coaching',
) {
  constructor(
    @Inject(PUB_SUB) private pubSub: PubSub,
    @Inject(forwardRef(() => MessagesService))
    private messagesService: MessagesService,
    @Inject(forwardRef(() => ChatsService))
    private chatsService: ChatsService,
  ) {
    super(pubSub, messagesService, chatsService);
  }
}
