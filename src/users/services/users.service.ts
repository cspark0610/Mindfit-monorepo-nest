import { Injectable } from '@nestjs/common';
import { Identifier } from 'sequelize/types';
import { User } from '../models/users.model';
import {
  CreateStaffUserDto,
  CreateUserDto,
  EditStaffUserDto,
  EditUserDto,
} from '../dto/users.dto';

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
  async getUser(id: Identifier): Promise<User> {
    return User.findByPk(id);
  }

  async editUser(id: number, userData: EditUserDto): Promise<User> {
    return User.update({ ...userData }, { where: { id } })[1];
  }

  async editStaffUser(id: number, userData: EditStaffUserDto): Promise<User> {
    return User.update({ ...userData }, { where: { id } })[1];
  }

  async bulkEditUsers(
    ids: Array<number>,
    userData: EditUserDto,
  ): Promise<[number, User[]]> {
    return User.update({ ...userData }, { where: { id: ids } });
  }

  async bulkEditStaffUsers(
    ids: Array<number>,
    userData: EditStaffUserDto,
  ): Promise<[number, User[]]> {
    return User.update({ ...userData }, { where: { id: ids } });
  }

  async deactivateUser(id: Identifier): Promise<User> {
    const [number, users] = await User.update(
      { isActive: false },
      {
        where: { id },
      },
    );

    if (number <= 0) {
      console.log('User not Found'); //TODO Add an appropiate return
    }

    return users[0];
  }

  async deleteUser(id: Identifier): Promise<number> {
    return User.destroy({ where: { id } });
  }

  async bulkDeleteUsers(ids: Array<number>): Promise<number> {
    return User.destroy({ where: { id: ids } });
  }
}
