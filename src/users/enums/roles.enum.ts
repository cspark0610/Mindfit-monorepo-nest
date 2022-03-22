import { registerEnumType } from '@nestjs/graphql';

export enum Roles {
  COACH = 'COACH',
  COACHEE = 'COACHEE',
  COACHEE_OWNER = 'COACHEE_OWNER',
  COACHEE_ADMIN = 'COACHEE_ADMIN',
  STAFF = 'STAFF',
  SUPER_USER = 'SUPER_USER',
}

registerEnumType(Roles, {
  name: 'Roles',
});
