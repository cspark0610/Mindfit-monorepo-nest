import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CoachingChatValidatorGuard } from 'src/subscriptions/guards/coachingChatValidator.guard';
import { Chat } from 'src/subscriptions/models/chat.model';
import { BaseChatResolver } from 'src/subscriptions/resolvers/baseChat.resolver';
import { ChatsService } from 'src/subscriptions/services/chats.service';
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
  CoachingChatValidatorGuard,
)
export class CoachingChatResolver extends BaseChatResolver(Chat, 'Coaching') {
  constructor(private chatsService: ChatsService) {
    super(chatsService);
  }
}
