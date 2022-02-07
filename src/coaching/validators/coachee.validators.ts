import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { User } from 'src/users/models/users.model';

export const haveCoacheeProfile = (user: User): boolean =>
  user?.coachee ? true : false;

/**
 * Return true if user have a coachee invitation waiting for accept
 *
 **/
export const isInvitedAndWaiting = (user: User): boolean => {
  if (!haveCoacheeProfile(user)) {
    throw new MindfitException({
      error: 'The user does not have a profile as a coachee.',
      errorCode: `USER_WITHOUT_COACHEE_PROFILE`,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
  return user.coachee.invited ? !user.coachee.invitationAccepted : false;
};
