import { User } from '../models/users.model';

export const ownOrganization = (user: User): boolean =>
  user?.organization ? true : false;

export const isOrganizationAdmin = (user: User) => user.coachee?.isAdmin;