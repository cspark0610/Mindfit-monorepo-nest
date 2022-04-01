import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { JoinChatDto } from 'src/subscriptions/dto/joinChat.dto';
import { CoachingChatValidator } from 'src/subscriptions/validators/coachingChat.validator';

@Injectable()
export class CoachingChatValidatorGuard implements CanActivate {
  constructor(private coachingChatValidator: CoachingChatValidator) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const { data, chatId }: { data: JoinChatDto; chatId: number } =
      ctx.getArgs();
    const user: UserSession = ctx.getContext().req.user;

    await this.coachingChatValidator.validate({
      chatData: data,
      chatId,
      role: user.role,
      userId: user.userId,
    });

    return true;
  }
}
