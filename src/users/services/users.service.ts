import { Injectable } from '@nestjs/common';
import { User } from '../models/users.model';
import {
  CreateStaffUserDto,
  CreateUserDto,
  EditStaffUserDto,
  EditUserDto,
} from '../dto/users.dto';
import { FindManyOptions, Repository } from 'typeorm';
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
    return this.usersRepository.save({ ...userData, isVerified });
  }

  async createInvitedUser(userData: EditUserDto): Promise<User> {
    if (!userData.password) {
      userData.password = Math.random().toString(36).slice(-8);
    }
    return this.usersRepository.save(userData);
  }

  async getUsers(where?: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.find(where);
  }

  async getUser(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async editUsers(
    id: number | Array<number>,
    userData: EditUserDto | EditStaffUserDto,
  ): Promise<User | User[]> {
    const result = await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ ...userData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();
    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteUsers(id: number | Array<number>): Promise<number> {
    const result = await this.usersRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }
}
