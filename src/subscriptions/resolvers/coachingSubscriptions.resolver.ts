import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { PUB_SUB } from 'src/pubSub/pubSub.module';
import { Subscriptions } from 'src/subscriptions/enums/subscriptions.enum';
import { Message } from 'src/subscriptions/models/message.model';
import { User } from 'src/users/models/users.model';

@Resolver()
@UseGuards(JwtAuthGuard)
export class CoachingSubscriptionResolver {
  constructor(@Inject(PUB_SUB) private pubSub: PubSub) {}

  @Subscription(() => Message, {
    filter: (payload: {
      session: UserSession;
      message: Message;
      participants: User[];
    }) => {
      if (!payload?.session || !payload?.message || !payload?.participants)
        return false;

      return (
        payload.session.userId === payload.message.user.id ||
        payload.participants
          .map(({ id }) => id)
          .includes(payload.session.userId)
      );
    },
    resolve: (payload) => payload?.message || payload,
  })
  subscribeToCoachingChat() {
    return this.pubSub.asyncIterator(Subscriptions.COACHING_MESSAGES);
  }
}
