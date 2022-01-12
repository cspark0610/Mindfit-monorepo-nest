import { Injectable } from '@nestjs/common';
import { User } from '../models/users.model';
import { EditUserDto } from '../dto/users.dto';
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

  async createInvitedUser(userData: EditUserDto): Promise<User> {
    if (!userData.password) {
      userData.password = Math.random().toString(36).slice(-8);
    }

    return this.repository.save(userData);
  }
}
