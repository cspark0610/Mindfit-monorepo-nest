import { Roles } from 'src/users/enums/roles.enum';

export interface CoachingSubscriptionValidatorData {
  chatId: number;
  userId: number;
  role: Roles;
}
