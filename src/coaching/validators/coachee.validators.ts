import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { User } from 'src/users/models/users.model';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { EditCoacheeDto } from 'src/coaching/dto/coachee.dto';
import { actionType } from 'src/coaching/enums/actionType.enum';

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

export function validateIfCoacheesIdsIncludesHostUserId(
  coacheesIds: number[],
  hostUser: User,
): void {
  if (coacheesIds.includes(hostUser.id)) {
    throw new MindfitException({
      error: 'You cannot edit yourself as staff or super_user',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoachingError.ACTION_NOT_ALLOWED,
    });
  }
}
export function validateIfEditCoacheeDtoIncludesPicture(
  editCoacheeDto: EditCoacheeDto,
): void {
  if (editCoacheeDto.picture) {
    throw new MindfitException({
      error: 'You cannot edit picture',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoachingError.ACTION_NOT_ALLOWED,
    });
  }
}

export function validateIfHostUserIsSuspendingOrActivatingHimself(
  hostUserId: number,
  coacheeId: number,
  type: string,
): void {
  if (hostUserId == coacheeId) {
    throw new MindfitException({
      error:
        type === actionType.SUSPEND
          ? 'You cannot suspend your own profile'
          : 'You cannot activate your own profile',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoachingError.ACTION_NOT_ALLOWED,
    });
  }
}
