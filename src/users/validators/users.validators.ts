import { User } from 'src/users/models/users.model';

export const ownOrganization = (user: User): boolean =>
  user?.organization ? true : false;

export const isOrganizationAdmin = (user: User): boolean =>
  user?.coachee?.isAdmin ? true : false;

export const isOrganizationOwner = (user: User): boolean =>
  user.id == user?.organization?.owner?.id ? true : false;
