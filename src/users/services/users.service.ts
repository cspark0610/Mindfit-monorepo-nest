import { Injectable } from '@nestjs/common';
import { Identifier } from 'sequelize/types';
import { User } from '../models/users.model';
import { CreateStaffUserDto, CreateUserDto } from '../dto/users.dto';

@Injectable()
export class UsersService {
  // constructor() {}

  async createUser(userData: CreateUserDto, isVerified = false): Promise<User> {
    return User.create({
      ...userData,
      isVerified,
      isStaff: false,
      isSuperuser: false,
    });
  }

  async createStaffUser(
    userData: CreateStaffUserDto,
    isVerified = false,
    isSuperuser = false,
  ): Promise<User> {
    return User.create({
      ...userData,
      isVerified,
      isStaff: true,
      isSuperuser,
    });
  }

  // Add isStaff and isSuperUser false by default
  async getUsers(where: object): Promise<User[]> {
    return User.findAll({
      where,
      attributes: [
        'email',
        'Coach',
        'Coachee',
        'Organization',
        'isActive',
        'isStaff',
        'isSuperUser',
      ],
      order: ['email', 'DESC'],
    });
  }

  // Add isStaff and isSuperUser false by default
  async getUser(pk: Identifier): Promise<User> {
    return User.findByPk(pk);
  }

  async deactivateUser(pk: Identifier): Promise<User> {
    const [number, users] = await User.update(
      { isActive: false },
      {
        where: { pk },
      },
    );

    if (number <= 0) {
      console.log('User not Found'); //TODO Add an appropiate return
    }

    return users[0];
  }

  async deleteUser(pk: Identifier): Promise<number> {
    return User.destroy({ where: { pk } });
  }
}
