import { UseGuards } from '@nestjs/common';
import { Resolver, Args, Mutation, Int } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  ChangePasswordDto,
  CreateStaffUserDto,
  CreateUserDto,
  EditUserDto,
} from 'src/users/dto/users.dto';
import { User } from 'src/users/models/users.model';
import { UsersService } from 'src/users/services/users.service';
import { Roles } from 'src/users/enums/roles.enum';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User, {
  create: CreateUserDto,
  update: EditUserDto,
}) {
  constructor(protected readonly service: UsersService) {
    super();
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => ChangePasswordDto }) data: ChangePasswordDto,
  ): Promise<boolean> {
    await this.service.changePassword(session.userId, data);
    return true;
  }

  @Mutation(() => User)
  async createStaffUser(
    @Args('data', { type: () => CreateStaffUserDto }) data: CreateStaffUserDto,
  ): Promise<User> {
    return this.service.create(data);
    //TODO SEND VERIFICATION EMAIL
  }

  @Mutation(() => User)
  async activateUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<User | User[]> {
    //TODO Get and decode JWT
    //TODO Get user by token id
    return this.service.update(id, { isActive: true });
  }

  @Mutation(() => User)
  async deactivateUser(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<User | User[]> {
    //TODO SEND NOTIFICATION EMAIL
    return this.service.update(id, { isActive: false });
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => User, { name: `createUser` })
  async create(
    @Args('data', { type: () => CreateUserDto }) data: CreateUserDto,
  ): Promise<User> {
    return this.service.createUser(data);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => [User], { name: `createManyUser` })
  async createMany(
    @Args('data', { type: () => [CreateUserDto] }) usersData: CreateUserDto[],
  ): Promise<User[]> {
    return this.service.createManyUser(usersData);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => [User], { name: `updateUser` })
  async update(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('data', { type: () => EditUserDto })
    editUserDto: EditUserDto,
  ): Promise<User> {
    return this.service.updateUser(userId, editUserDto);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => [User], { name: `updateManyUsers` })
  async updateMany(
    @Args('userIds', { type: () => [Int] }) userIds: number[],
    @Args('data', { type: () => EditUserDto })
    editUserDto: EditUserDto,
  ): Promise<User[]> {
    return this.service.updateManyUsers(userIds, editUserDto);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Number, { name: `deleteManyUsers` })
  async deleteMany(
    @CurrentSession() session: UserSession,
    @Args('userIds', { type: () => [Int] }) userIds: number[],
  ): Promise<number> {
    return this.service.deleteManyUsers(session, userIds);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Number, { name: `deleteUser` })
  async delete(
    @CurrentSession() session: UserSession,
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<number> {
    return this.service.deleteUser(session, userId);
  }
}
