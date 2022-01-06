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
  async createUser(
    userData: CreateUserDto | CreateStaffUserDto,
    isVerified = false,
  ): Promise<User> {
    return User.create({
      ...userData,
      isVerified,
    });
  }
  // Add isStaff and isSuperUser false by default
  async getUsers(where?: object): Promise<User[]> {
    return User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['email', 'DESC']],
    });
  }

  // Add isStaff and isSuperUser false by default
  async getUser(id: Identifier): Promise<User> {
    return User.findByPk(id);
  }

  async editUsers(
    id: number | Array<number>,
    userData: EditUserDto | EditStaffUserDto,
  ): Promise<User | User[]> {
    const [, result] = await User.update(userData, {
      where: { id },
      returning: true,
    });
    return Array.isArray(id) ? result : result[0];
  }

  async deleteUsers(id: Identifier | Array<Identifier>): Promise<number> {
    return User.destroy({ where: { id } });
  }
}
