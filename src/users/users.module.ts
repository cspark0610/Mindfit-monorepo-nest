import { Module } from '@nestjs/common';
import { User } from './models/users.model';
import { UsersResolver } from './resolvers/users.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Coachee } from './models/coachee.model';
import { Coach } from './models/coach.model';
import { Organization } from './models/organization.model';
import { CoachAplication } from './models/coachAplication.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Coachee,
      Coach,
      Organization,
      CoachAplication,
    ]),
  ],
  providers: [UsersResolver],
})
export class UsersModule {}
