import { User } from 'src/users/models/users.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';
import { EditUserDto } from 'src/users/dto/users.dto';
import { editOrganizationError } from 'src/organizations/enums/editOrganization.enum';

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
