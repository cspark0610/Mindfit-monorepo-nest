import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Coachee } from '../models/coachee.model';
import { CoacheeService } from '../services/coachee.service';
import {
  CoacheeDto,
  EditCoacheeDto,
  InviteCoacheeDto,
} from '../dto/coachee.dto';
import { UsersService } from '../../users/services/users.service';
import { FindManyOptions } from 'typeorm';

@Resolver(() => Coachee)
export class CoacheesResolver {
  constructor(
    private coacheeService: CoacheeService,
    private userService: UsersService,
  ) {}
  @Query(() => Coachee)
  async getCoachee(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Coachee> {
    return this.coacheeService.getCoachee(id);
  }
  @Query(() => [Coachee])
  async getCoachees(
    @Args('where', { type: () => String, nullable: true })
    where: FindManyOptions<Coachee>,
  ): Promise<Coachee[]> {
    return this.coacheeService.getCoachees(where);
  }
  @Mutation(() => Coachee)
  async inviteCoachee(
    @Args('data', { type: () => InviteCoacheeDto }) data: InviteCoacheeDto,
  ): Promise<Coachee> {
    const { user: userData, ...coacheeData } = data;
    const user = await this.userService.createInvitedUser(userData);
    try {
      const coachee = await this.coacheeService.createCoachee({
        userId: user.id,
        ...coacheeData,
      });
      return coachee;
    } catch (error) {
      await this.userService.deleteUsers(user.id);
    }
    // TODO SEND INVITATION EMAILS
  }
  @Mutation(() => Coachee)
  async createCoachee(
    @Args('data', { type: () => CoacheeDto }) data: CoacheeDto,
  ): Promise<Coachee> {
    return this.coacheeService.createCoachee(data);
  }
  @Mutation(() => Coachee)
  async editCoachee(
    @Args('id', { type: () => Int }) id: number,
    @Args('data', { type: () => EditCoacheeDto }) data: EditCoacheeDto,
  ): Promise<Coachee | Coachee[]> {
    return this.coacheeService.editCoachees(id, data);
  }
  @Mutation(() => [Coachee])
  async editCoachees(
    @Args('ids', { type: () => Int }) ids: number[],
    @Args('data', { type: () => EditCoacheeDto }) data: EditCoacheeDto,
  ): Promise<Coachee | Coachee[]> {
    return this.coacheeService.editCoachees(ids, data);
  }
  @Mutation(() => Number)
  async deleteCoachee(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<number> {
    return this.coacheeService.deleteCoachees(id);
  }
  @Mutation(() => Number)
  async deleteCoachees(
    @Args('ids', { type: () => Int }) ids: number[],
  ): Promise<number> {
    return this.coacheeService.deleteCoachees(ids);
  }
}
