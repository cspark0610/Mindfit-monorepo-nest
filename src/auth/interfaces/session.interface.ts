import { Roles } from 'src/users/enums/roles.enum';
export interface UserSession {
  userId: number;
  email: string;
  role: Roles;
  refreshToken?: string;
}
