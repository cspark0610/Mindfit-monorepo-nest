import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { User } from 'src/users/models/users.model';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { EditCoacheeDto, CoacheeDto } from 'src/coaching/dto/coachee.dto';
import { actionType } from 'src/coaching/enums/actionType.enum';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import {
  EditOrganizationDto,
  OrganizationDto,
} from 'src/organizations/dto/organization.dto';

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

export function validateIfCoacheeHasOrganization(coachee: Coachee) {
  if (!coachee.organization) {
    throw new MindfitException({
      error: 'No organization found',
      errorCode: 'ORGANIZATION_NOT_FOUND',
      statusCode: HttpStatus.NOT_FOUND,
    });
  }
}

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
export function validateIfDtoIncludesPicture(
  dto: CoacheeDto | OrganizationDto | EditCoacheeDto | EditOrganizationDto,
): void {
  if (dto.picture) {
    throw new MindfitException({
      error: 'You cannot create/edit picture',
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

/**
 * validate if a coachee to suspend/activate is part of the owner organization
 */
export function validateIfCoacheeToSuspenIsInCoacheeOrganization(
  hostUser: User,
  coachee: Coachee,
  type: string,
): void {
  if (hostUser.coachee.organization.id !== coachee.organization.id) {
    throw new MindfitException({
      error:
        type === actionType.SUSPEND
          ? 'You cannot suspend this Coachee because he/she does not belong to your organization'
          : 'You cannot activate this Coachee because he/she does not belong to your organization',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode:
        type === actionType.SUSPEND
          ? CoacheeErrors.COACHEE_FROM_ANOTHER_ORGANIZATION
          : CoacheeErrors.COACHEE_FROM_ANOTHER_ORGANIZATION,
    });
  }
}
/**
 * validate is coachee is already suspended
 */
export function isCoacheeAlreadySuspended(
  coachee: Coachee,
  type: string,
): void {
  if (type === actionType.SUSPEND && coachee.isSuspended) {
    throw new MindfitException({
      error: 'Coachee is already suspended',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoacheeErrors.COACHEE_ALREADY_SUSPENDED,
    });
  }
}

/**
 * validate is coachee is already activated
 */
export function isCoacheeAlreadyActivated(
  coachee: Coachee,
  type: string,
): void {
  if (type === actionType.ACTIVATE && coachee.isActive) {
    throw new MindfitException({
      error: 'Coachee is already active',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoacheeErrors.COACHEE_ALREADY_ACTIVE,
    });
  }
}
