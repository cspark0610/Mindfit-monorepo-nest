import { HttpStatus, Injectable } from '@nestjs/common';
import { CoachService } from 'src/coaching/services/coach.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { JoinChatDto } from 'src/subscriptions/dto/joinChat.dto';
import { CoachingChatValidatorData } from 'src/subscriptions/interfaces/coachingChatValidatorData.interface';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { Roles } from 'src/users/enums/roles.enum';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class CoachingChatValidator {
  constructor(
    private usersService: UsersService,
    private coachService: CoachService,
    private chatsService: ChatsService,
  ) {}

  async validate(data: CoachingChatValidatorData): Promise<void> {
    await Promise.all([
      this.validateCoacheeChats(data),
      this.validateCoachChat(data),
      this.getChatValidation(data),
    ]);
  }

  async getChatValidation({
    userId,
    chatId,
  }: CoachingChatValidatorData): Promise<void> {
    if (!chatId || !userId) return;

    const chat = await this.chatsService.findOneBy({ where: { id: chatId } });

    const verifyUserInChat = chat.users.some((user) => user.id === userId);

    if (!verifyUserInChat)
      throw new MindfitException({
        error: `You are not in this chat: ${chatId}.`,
        errorCode: 'NOT_FOUND_USER_IN_CHAT',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
  }

  async validateCoacheeChats({
    chatData,
    userId,
    role,
  }: CoachingChatValidatorData): Promise<void> {
    if (
      ![Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER].includes(
        role,
      ) ||
      !chatData
    )
      return;

    const [chat, user] = await Promise.all([
      JoinChatDto.from(chatData),
      this.usersService.findOneBy({ where: { id: userId } }),
    ]);

    const assignedCoach = await this.coachService.findOneBy({
      where: { id: user.coachee.assignedCoach.id },
    });

    const notChatWithCoach = chat.users.some(
      ({ id }) => id !== userId && id !== assignedCoach.user.id,
    );

    if (notChatWithCoach)
      throw new MindfitException({
        error: 'Coachee can only send messages to the assigned coach.',
        errorCode: 'COACHEE_ONLY_CAN_SEND_MESSAGES_TO_ASSIGNED_COACH',
        statusCode: HttpStatus.BAD_REQUEST,
      });
  }

  async validateCoachChat({
    chatData,
    userId,
    role,
  }: CoachingChatValidatorData): Promise<void> {
    if (Roles.COACH !== role || !chatData) return;

    const [chat, user] = await Promise.all([
      JoinChatDto.from(chatData),
      this.usersService.findOneBy({ where: { id: userId } }),
    ]);

    const coach = await this.coachService.findOneBy({
      where: { id: user.coach.id },
    });

    const assignedCoacheeIds = coach.assignedCoachees.map(
      (coachee) => coachee.user.id,
    );

    const notTalkingWithAssignedCoachees = chat.users.some(
      (user) => !assignedCoacheeIds.includes(user.id) && user.id !== userId,
    );

    if (notTalkingWithAssignedCoachees)
      throw new MindfitException({
        error: 'Coach can only send messages to assigned coachees.',
        errorCode: 'COACH_ONLY_CAN_SEND_MESSAGES_TO_ASSIGNED_COACHEES',
        statusCode: HttpStatus.BAD_REQUEST,
      });
  }
}
