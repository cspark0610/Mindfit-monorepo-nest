import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsSesService } from 'src/aws/services/ses.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { Emails } from 'src/strapi/enum/emails.enum';
import { ChangePasswordDto, EditUserDto } from 'src/users/dto/users.dto';
import { User } from 'src/users/models/users.model';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private awsSesService: AwsSesService,
  ) {
    super();
  }

  async findAll(where?: FindManyOptions<User>): Promise<User[]> {
    const result = await this.repository.find({
      ...where,
      relations: ['organization', 'coachee', 'coach'],
    });
    return result;
  }

  async findOne(id: number, options?: FindOneOptions<User>): Promise<User> {
    const result = await this.repository.findOne(id, {
      ...options,
      relations: ['organization', 'coachee', 'coach'],
    });
    if (!result) {
      throw new MindfitException({
        error: `${this.repository.metadata.name} with id ${id} not found.`,
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return result;
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    if (data.password !== data.confirmPassword)
      throw new MindfitException({
        error: 'Password not matching',
        errorCode: 'PASSWORD_NOT_MATCHING',
        statusCode: HttpStatus.BAD_REQUEST,
      });

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
