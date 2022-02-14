import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DayAvailabilityObjectType } from 'src/agenda/models/availabilityCalendar.model';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateCoachAgendaDto,
  EditCoachAgendaDto,
} from '../dto/coachAgenda.dto';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAgendaService } from '../services/coachAgenda.service';
import { Roles } from 'src/users/enums/roles.enum';

@Resolver(() => CoachAgenda)
export class CoachAgendaResolver extends BaseResolver(CoachAgenda, {
  create: CreateCoachAgendaDto,
  update: EditCoachAgendaDto,
}) {
  constructor(protected readonly service: CoachAgendaService) {
    super();
  }

  // TODO Add Validator in UpdateCoachAgenda

  @Query(() => [DayAvailabilityObjectType])
  async getCoachAvailability(
    @Args('coachAgendaId', { type: () => Number }) coachAgendaId: number,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ): Promise<DayAvailabilityObjectType[]> {
    const coachAgenda = await this.service.findOne(coachAgendaId);
    return this.service.getAvailabilityByMonths(coachAgenda, from, to);
  }

  @Mutation(() => CoachAgenda)
  // @RolesGuard(Roles.SUPER_USER)
  async create(
    @Args('createCoachAgendaDto', { type: () => CreateCoachAgendaDto })
    data: CreateCoachAgendaDto,
    @Args('coachId', { type: () => Int }) coachId: number,
  ): Promise<CoachAgenda> {
    const createCoachAgendaDto = await CreateCoachAgendaDto.from(data);
    return this.service.createCoachAgendaWithCoach(
      createCoachAgendaDto,
      coachId,
    );
  }
}
