import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { MessageDto } from 'src/subscriptions/dto/message.dto';
import { CoachingSubscriptionValidator } from 'src/subscriptions/validators/coachingSubscriptions.validator';

@Injectable()
export class CoachingSubscriptionValidatorGuard implements CanActivate {
  constructor(
    private coachingSubscriptionValidator: CoachingSubscriptionValidator,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const { data, chatId }: { data: MessageDto; chatId: number } =
      ctx.getArgs();
    const user: UserSession = ctx.getContext().req.user;

    await this.coachingSubscriptionValidator.validate({
      chatId: data?.chatId || chatId,
      role: user.role,
      userId: user.userId,
    });

    return true;
  }
}
