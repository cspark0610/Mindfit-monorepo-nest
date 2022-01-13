import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../models/users.model';
import { ChangePasswordDto, EditUserDto } from '../dto/users.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/service/base.service';
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super();
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    if (data.password !== data.confirmPassword)
      throw new BadRequestException('Password not matching');

    return this.update(id, {
      password: data.password,
    }) as Promise<User>;
  }

  async createInvitedUser(
    userData: EditUserDto,
  ): Promise<{ user: User; password: string }> {
    if (!userData.password) {
      userData.password = Math.random().toString(36).slice(-8);
    }
    const entity = this.repository.create(userData);
    return {
      user: await this.repository.save(entity),
      password: userData.password,
    };
  }
}
