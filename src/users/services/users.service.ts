import { Injectable } from '@nestjs/common';
import { User } from '../models/users.model';
import {
  CreateStaffUserDto,
  CreateUserDto,
  EditStaffUserDto,
  EditUserDto,
} from '../dto/users.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(
    userData: CreateUserDto | CreateStaffUserDto,
    isVerified = false,
  ): Promise<User> {
    return this.usersRepository.create({
      ...userData,
      isVerified,
    });
  }
  // Add isStaff and isSuperUser false by default
  async getUsers(where?: object): Promise<User[]> {
    return this.usersRepository.find({
      where,
    });
  }

  // Add isStaff and isSuperUser false by default
  async getUser(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
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

  async deleteUsers(id: number | Array<number>): Promise<number> {
    return User.destroy({ where: { id } });
  }
}
