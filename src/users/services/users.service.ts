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

  async editUser(id: number, userData: EditUserDto): Promise<User> {
    const user = await User.findByPk(id);
    user.update({ ...userData });
    return user;
  }

  async editStaffUser(id: number, userData: EditStaffUserDto): Promise<User> {
    return User.update({ ...userData }, { where: { id } })[1];
  }

  async bulkEditUsers(
    ids: Array<number>,
    userData: EditUserDto,
  ): Promise<User[]> {
    const result = await User.update(
      { ...userData },
      { where: { id: ids }, returning: true },
    );
    return result[1];
  }

  async bulkEditStaffUsers(
    ids: Array<number>,
    userData: EditStaffUserDto,
  ): Promise<User[]> {
    const result = await User.update(
      { ...userData },
      { where: { id: ids }, returning: true },
    );
    return result[1];
  }

  async deactivateUser(id: Identifier): Promise<User> {
    const user = await User.findByPk(id);
    user.update({ isActive: false });
    return user;
  }

  async activateUser(id: Identifier): Promise<User> {
    const user = await User.findByPk(id);
    user.update({ isActive: true });
    return user;
  }

  async deleteUser(id: Identifier): Promise<number> {
    return User.destroy({ where: { id } });
  }

  async bulkDeleteUsers(ids: Array<number>): Promise<number> {
    return User.destroy({ where: { id: ids } });
  }
}
