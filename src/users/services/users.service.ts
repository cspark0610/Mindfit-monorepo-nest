import { HttpStatus, Injectable } from '@nestjs/common';
import { AwsSesService } from 'src/aws/services/ses.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { Emails } from 'src/strapi/enum/emails.enum';
import { ChangePasswordDto, EditUserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/models/users.model';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    protected readonly repository: UserRepository,
    private awsSesService: AwsSesService,
  ) {
    super();
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    if (data.password !== data.confirmPassword)
      throw new MindfitException({
        error: 'Password not matching',
        errorCode: 'PASSWORD_NOT_MATCHING',
        statusCode: HttpStatus.BAD_REQUEST,
      });

    const user = await this.update(id, {
      password: data.password,
    });

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
    const user = await this.repository.create(userData);
    return {
      user,
      password: userData.password,
    };
  }
}
