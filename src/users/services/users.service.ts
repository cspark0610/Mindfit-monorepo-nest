import { HttpStatus, Injectable } from '@nestjs/common';
import { AwsSesService } from 'src/aws/services/ses.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { Emails } from 'src/strapi/enum/emails.enum';
import {
  ChangePasswordDto,
  CreateUserDto,
  EditUserDto,
} from 'src/users/dto/users.dto';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UserSession } from 'src/auth/interfaces/session.interface';

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

    const actualUser = await this.findOne(id);

    const verify = User.verifyPassword(
      data.actualPassword,
      actualUser.password,
    );

    if (!verify)
      throw new MindfitException({
        error: 'Actual password not matching',
        errorCode: 'ACTUAL_PASSWORD_NOT_MATCHING',
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
    role: Roles,
  ): Promise<{ user: User; password: string }> {
    if (!userData.password) {
      userData.password = Math.random().toString(36).slice(-8);
    }
    const user = await this.repository.create({ role, ...userData });
    return {
      user,
      password: userData.password,
    };
  }
  async getUserByOrganizationId(organizationId: number): Promise<User> {
    return this.repository.getUserByOrganizationId(organizationId);
  }

  //
  async createUser(data: CreateUserDto): Promise<User> {
    return this.repository.create(data);
  }

  async createManyUser(usersData: CreateUserDto[]): Promise<User[]> {
    return this.repository.createMany(usersData);
  }

  async updateManyUsers(
    userIds: number[],
    editUserDto: EditUserDto,
  ): Promise<User[]> {
    return this.repository.updateMany(userIds, editUserDto);
  }

  validateIfHostUserIdIsInUsersIdsToDelete(
    usersIdsToDelete: number[],
    hostUser: User,
  ): void {
    if (usersIdsToDelete.includes(hostUser.id)) {
      throw new MindfitException({
        error: 'You cannot delete yourself as staff or super_user',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'You cannot delete yourself as staff or super_user',
      });
    }
  }

  async deleteManyUsers(
    session: UserSession,
    userIds: number[],
  ): Promise<number> {
    const hostUser: User = await this.findOne(session.userId);
    const promiseUsersArr: Promise<User>[] = userIds.map(async (userId) =>
      Promise.resolve(await this.findOne(userId)),
    );
    const usersIdsToDelete: number[] = (await Promise.all(promiseUsersArr)).map(
      (user) => user.id,
    );
    this.validateIfHostUserIdIsInUsersIdsToDelete(usersIdsToDelete, hostUser);
    return this.repository.delete(userIds);
  }

  validateIfHostUserIdIsUserToDelete(userToDelete: User, hostUser: User): void {
    if (userToDelete.id == hostUser.id) {
      throw new MindfitException({
        error: 'You cannot delete yourself as staff or super_user',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'You cannot delete yourself as staff or super_user',
      });
    }
  }

  async deleteUser(session: UserSession, userId: number): Promise<number> {
    const hostUser: User = await this.findOne(session.userId);
    const userToDelete: User = await this.findOne(userId);

    this.validateIfHostUserIdIsUserToDelete(userToDelete, hostUser);
    return this.repository.delete(userToDelete.id);
  }
}
