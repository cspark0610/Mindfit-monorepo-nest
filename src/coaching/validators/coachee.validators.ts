import { BadRequestException } from '@nestjs/common';
import { User } from 'src/users/models/users.model';

export const haveCoacheeProfile = (user: User): boolean =>
  user?.coachee ? true : false;

/**
 * Return true if user have a coachee invitation waiting for accept
 *
 **/
export const isInvitedAndWaiting = (user: User): boolean => {
  if (!haveCoacheeProfile(user)) {
    throw new BadRequestException(
      'The user does not have a profile as a coachee.',
    );
  }
  return user.coachee.invited ? !user.coachee.invitationAccepted : false;
};
