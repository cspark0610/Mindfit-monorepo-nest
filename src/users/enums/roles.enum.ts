import { registerEnumType } from '@nestjs/graphql';

export enum Roles {
  COACH = 'COACH',
  COACHEE = 'COACHEE',
  STAFF = 'STAFF',
  SUPER_USER = 'SUPER_USER',
}

registerEnumType(Roles, {
  name: 'Roles',
});
