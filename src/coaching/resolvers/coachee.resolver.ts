import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Identifier } from 'sequelize/types';
import { Coachee } from '../models/coachee.model';
import { CoacheeService } from '../services/coachee.service';
import { WhereOptions } from 'sequelize/types';
import {
  CoacheeDto,
  EditCoacheeDto,
  InviteCoacheeDto,
} from '../dto/coachee.dto';
import { UsersService } from 'src/users/services/users.service';

@Resolver(() => Coachee)
export class CoacheesResolver {
  constructor(
    private coacheeService: CoacheeService,
    private userService: UsersService,
  ) {}
  @Query(() => Coachee)
  async getCoachee(
    @Args('id', { type: () => Int }) id: Identifier,
  ): Promise<Coachee> {
    return this.coacheeService.getCoachee(id);
  }

  @Query(() => [Coachee])
  async getCoachees(
    @Args('where', { type: () => Object }) where: WhereOptions,
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
        user: user.id,
        ...coacheeData,
      });
      return coachee;
    } catch (error) {
      user.destroy();
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
    @Args('id', { type: () => Int }) id: Identifier,
    @Args('data', { type: () => EditCoacheeDto }) data: EditCoacheeDto,
  ): Promise<Coachee | Coachee[]> {
    return this.coacheeService.editCoachees(id, data);
  }

  @Mutation(() => [Coachee])
  async editCoachees(
    @Args('ids', { type: () => Int }) ids: Identifier[],
    @Args('data', { type: () => EditCoacheeDto }) data: EditCoacheeDto,
  ): Promise<Coachee | Coachee[]> {
    return this.coacheeService.editCoachees(ids, data);
  }

  @Mutation(() => Coachee)
  async deleteCoachee(
    @Args('id', { type: () => Int }) id: Identifier,
  ): Promise<number> {
    return this.coacheeService.deleteCoachees(id);
  }

  @Mutation(() => [Coachee])
  async deleteCoachees(@Args('ids', { type: () => Int }) ids: Identifier[]) {
    this.coacheeService.deleteCoachees(ids);
  }
}
