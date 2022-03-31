import { HttpStatus, Injectable } from '@nestjs/common';
import { CoachService } from 'src/coaching/services/coach.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoachingSubscriptionValidatorData } from 'src/subscriptions/interfaces/coachingSubscriptionValidatorData.interface';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { Roles } from 'src/users/enums/roles.enum';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class CoachingSubscriptionValidator {
  constructor(
    private chatsService: ChatsService,
    private usersService: UsersService,
    private coachService: CoachService,
  ) {}

  async validate(data: CoachingSubscriptionValidatorData): Promise<void> {
    await Promise.all([
      this.validateCoacheeInteractionInChats(data),
      this.validateCoachInteractionsInChat(data),
    ]);
  }

  async validateCoacheeInteractionInChats({
    chatId,
    userId,
    role,
  }: CoachingSubscriptionValidatorData): Promise<void> {
    if (
      ![Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER].includes(role)
    )
      return;

    const [chat, user] = await Promise.all([
      this.chatsService.findOneBy({ id: chatId }),
      this.usersService.findOneBy({ id: userId }),
    ]);

    const assignedCoach = await this.coachService.findOneBy({
      id: user.coachee.assignedCoach.id,
    });

    const talkingWithAssignedCoach = chat.users.find(
      ({ id }) => id === assignedCoach.user.id,
    );

    if (!talkingWithAssignedCoach)
      throw new MindfitException({
        error: 'Coachee can only send messages to the assigned coach.',
        errorCode: 'COACHEE_ONLY_CAN_SEND_MESSAGES_TO_ASSIGNED_COACH',
        statusCode: HttpStatus.BAD_REQUEST,
      });
  }

  async validateCoachInteractionsInChat({
    chatId,
    userId,
    role,
  }: CoachingSubscriptionValidatorData): Promise<void> {
    if (Roles.COACH !== role) return;

    const [chat, user] = await Promise.all([
      this.chatsService.findOneBy({ id: chatId }),
      this.usersService.findOneBy({ id: userId }),
    ]);

    const coach = await this.coachService.findOneBy({ id: user.coach.id });

    const assignedCoacheeIds = coach.assignedCoachees.map(
      (coachee) => coachee.user.id,
    );

    const notTalkingWithAssignedCoachees = chat.users.some(
      (user) => !assignedCoacheeIds.includes(user.id),
    );

    if (notTalkingWithAssignedCoachees)
      throw new MindfitException({
        error: 'Coach can only send messages to assigned coachees.',
        errorCode: 'COACH_ONLY_CAN_SEND_MESSAGES_TO_ASSIGNED_COACHEES',
        statusCode: HttpStatus.BAD_REQUEST,
      });
  }
}
