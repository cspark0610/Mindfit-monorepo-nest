import { User } from 'src/users/models/users.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';
import { EditUserDto } from 'src/users/dto/users.dto';
import { editOrganizationError } from 'src/organizations/enums/editOrganization.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { Roles } from 'src/users/enums/roles.enum';

export const ownOrganization = (user: User): boolean =>
  user?.organization?.id ? true : false;

export const isOrganizationAdmin = (user: User): boolean =>
  user?.coachee?.isAdmin ? true : false;

export const isOrganizationOwner = (user: User): boolean =>
  user?.organization?.id == user?.coachee?.organization?.id ? true : false;

export function validateIfHostUserIdIsInUsersIdsToDelete(
  usersIdsToDelete: number[],
  hostUser: User,
): void {
  if (usersIdsToDelete.includes(hostUser.id)) {
    throw new MindfitException({
      error: 'You cannot delete yourself as staff or super_user',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'You cannot delete yourself as staff or super_user',
    });
  }
}

export function validateIfHostUserIdIsUserToDelete(
  userToDelete: User,
  hostUser: User,
): void {
  if (userToDelete.id == hostUser.id) {
    throw new MindfitException({
      error: 'You cannot delete yourself as staff or super_user',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'You cannot delete yourself as staff or super_user',
    });
  }
}

export function validateIfHostUserIdIsUserToEdit(
  userId: number,
  hostUser: User,
): void {
  if (userId != hostUser.id) {
    throw new MindfitException({
      error: 'You cannot edit a user that is not yours',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'You cannot edit a user that is not yours',
    });
  }
}

export function validateStaffOrSuperUserIsEditingPassword(
  editUserDto: EditUserDto,
): void {
  if (editUserDto.password) {
    throw new MindfitException({
      error: 'You cannot update password',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: 'CANNOT_UPDATE_PASSWORD',
    });
  }
}

export function validateOwnerCanEditOrganization(
  organizationId: number,
  user: User,
): void {
  if (organizationId !== user.organization.id) {
    throw new MindfitException({
      error: 'Owner can only edit its own organization',
      errorCode: editOrganizationError.USER_CAN_ONLY_EDIT_OWN_ORGANIZATION,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export function validateCoacheeAdminCanEditOrganization(
  organizationId: number,
  user: User,
): void {
  if (organizationId !== user.coachee.organization.id) {
    throw new MindfitException({
      error: 'Coachee admin can only edit its own organization',
      errorCode: editOrganizationError.COACHEE_CAN_ONLY_EDIT_OWN_ORGANIZATION,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}


export function validateStaffOrSuperUserRole(role: Roles): void {
  if (![Roles.SUPER_USER, Roles.STAFF].includes(role)) {
    throw new MindfitException({
      error: 'Forbidden role to sign in',
      errorCode: 'FORBIDDEN ROLE TO SIGN IN',
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
} 

export function validateIfUserHasCoacheeProfile(user: User): void {
  if (!user.coachee) {
    throw new MindfitException({
      error: `The user does not have a coachee profile`,
      errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
      statusCode: HttpStatus.BAD_REQUEST,

    });
  }
}


export function validateIfUserIsSuspended(
  role: Roles,
  isSuspended: boolean,
): void {
  if (
    [Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER].includes(role) &&
    isSuspended
  ) {
    throw new MindfitException({
      error: 'Suspended User Coachee',
      errorCode: 'SUSPENDED_USER_COACHEE',
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}

export function validateIfUserHasCoacheeRole(user: User): void {
  if (user.role != Roles.COACHEE) {
    throw new MindfitException({
      error: `The coachee profile does not have a COACHEE role.`,
      errorCode: CoacheeErrors.NO_COACHEE_ROLE,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export function validateIfUserCoacheeIsInvited(user: User): void {
  if (!user.coachee?.invited) {
    throw new MindfitException({
      error: `Coachee id ${user.coachee.id} has no invitation.`,
      errorCode: CoacheeErrors.COACHEE_NOT_INVITED,
      statusCode: HttpStatus.BAD_REQUEST,
    });
  }
}

export function validateIfUserHasAssignedCoach(user: User): void {
  if (user.coachee?.assignedCoach) {
    throw new MindfitException({
      error: 'You already has a Coach Assigned.',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoacheeErrors.COACHEE_ALREADY_HAS_COACH,
    });
  }
}
