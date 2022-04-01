import { JoinChatDto } from 'src/subscriptions/dto/joinChat.dto';
import { Roles } from 'src/users/enums/roles.enum';

export interface CoachingChatValidatorData {
  chatData: JoinChatDto;
  userId: number;
  chatId: number;
  role: Roles;
}
