import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { CoachDto, EditCoachDto } from '../dto/coach.dto';
import { Coach } from '../models/coach.model';
import { CoachService } from '../services/coach.service';
import { FindManyOptions } from 'typeorm';

@Resolver(() => Coach)
export class CoachResolver {
  constructor(private coachService: CoachService) {}

  @Query(() => [Coach])
  async getCoachs(
    @Args('where', { type: () => String, nullable: true })
    where: FindManyOptions<Coach>,
  ): Promise<Coach[]> {
    return this.coachService.getCoachs(where);
  }

  @Query(() => Coach)
  async getCoach(@Args('id', { type: () => Int }) id: number): Promise<Coach> {
    return this.coachService.getCoach(id);
  }

  @Mutation(() => Coach)
  async createCoach(
    @Args('data', { type: () => CoachDto }) data: CoachDto,
  ): Promise<Coach> {
    return this.coachService.createCoach(data);
  }

  @Mutation(() => Coach)
  async editCoach(
    @Args('id', { type: () => Int }) id: number,
    @Args('data', { type: () => EditCoachDto }) data: EditCoachDto,
  ): Promise<Coach | Coach[]> {
    return this.coachService.editCoachs(id, data);
  }

  @Mutation(() => [Coach])
  async editCoachs(
    @Args('ids', { type: () => [Int] }) ids: number[],
    @Args('data', { type: () => EditCoachDto }) data: EditCoachDto,
  ): Promise<Coach | Coach[]> {
    return this.coachService.editCoachs(ids, data);
  }

  @Mutation(() => Coach)
  async activateCoach(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Coach | Coach[]> {
    return this.coachService.editCoachs(id, { isActive: true });
  }

  @Mutation(() => Coach)
  async deactivateCoach(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Coach | Coach[]> {
    return this.coachService.editCoachs(id, { isActive: false });
  }

  @Mutation(() => Number)
  async deleteCoach(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<number> {
    return this.coachService.deleteCoachs(id);
  }

  @Mutation(() => Number)
  async deleteCoachs(
    @Args('ids', { type: () => [Int] }) ids: number[],
  ): Promise<number> {
    return this.coachService.deleteCoachs(ids);
  }
}
