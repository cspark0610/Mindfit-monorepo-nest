import { User } from 'src/users/models/users.model';

export const haveCoachProfile = (user: User): boolean =>
  user?.coach ? true : false;
