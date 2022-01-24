import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../models/users.model';
import { ChangePasswordDto, EditUserDto } from '../dto/users.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/service/base.service';
import { AwsSesService } from 'src/aws/services/ses.service';
import { Emails } from 'src/strapi/enum/emails.enum';
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private awsSesService: AwsSesService,
  ) {
    super();
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    if (data.password !== data.confirmPassword)
      throw new BadRequestException('Password not matching');

    const user = (await this.update(id, {
      password: data.password,
    })) as User;

    await this.awsSesService.sendEmail({
      subject: 'Mindfit - Changed Password',
      template: Emails.CHANGE_PASSWORD,
      to: [user.email],
    });

    return user;
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
