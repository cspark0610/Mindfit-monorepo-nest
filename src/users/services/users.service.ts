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
import {
  validateStaffOrSuperUserIsEditingPassword,
  validateIfHostUserIdIsInUsersIdsToDelete,
  validateIfHostUserIdIsUserToDelete,
  validateIfHostUserIdIsUserToEdit,
} from 'src/users/validators/users.validators';

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

    const actualUser = await this.findOne({ id });

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
      language: user.language,
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

  async updateUser(
    session: UserSession,
    userId: number,
    data: EditUserDto,
  ): Promise<User> {
    const hostUser: User = await this.findOne({
      id: session.userId,
    });

    if ([Roles.SUPER_USER, Roles.STAFF].includes(hostUser.role)) {
      validateStaffOrSuperUserIsEditingPassword(data);
      return this.repository.update(userId, data);
    }

    validateIfHostUserIdIsUserToEdit(userId, hostUser);
    return this.repository.update(userId, data);
  }

  async updateManyUsers(
    userIds: number[],
    editUserDto: EditUserDto,
  ): Promise<User[]> {
    validateStaffOrSuperUserIsEditingPassword(editUserDto);
    return this.repository.updateMany(userIds, editUserDto);
  }

  async deleteManyUsers(
    session: UserSession,
    userIds: number[],
  ): Promise<number> {
    const hostUser: User = await this.findOne({
      id: session.userId,
    });

    validateIfHostUserIdIsInUsersIdsToDelete(userIds, hostUser);
    return this.repository.delete(userIds);
  }

  async deleteUser(session: UserSession, userId: number): Promise<number> {
    const [hostUser, userToDelete] = await Promise.all([
      this.findOne({
        id: session.userId,
      }),
      this.findOne({
        id: userId,
      }),
    ]);

    validateIfHostUserIdIsUserToDelete(userToDelete, hostUser);
    return this.repository.delete(userToDelete.id);
  }
}
