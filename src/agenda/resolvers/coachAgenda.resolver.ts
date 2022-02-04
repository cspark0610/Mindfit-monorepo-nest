import { Args, Query, Resolver } from '@nestjs/graphql';
import { DayAvailabilityObjectType } from 'src/agenda/models/availabilityCalendar.model';
import { ParseDatePipe } from 'src/common/pipes/ParseDatePipe';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateCoachAgendaDto,
  EditCoachAgendaDto,
} from '../dto/coachAgenda.dto';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAgendaService } from '../services/coachAgenda.service';

@Resolver(() => CoachAgenda)
export class CoachAgendaResolver extends BaseResolver(CoachAgenda, {
  create: CreateCoachAgendaDto,
  update: EditCoachAgendaDto,
}) {
  constructor(protected readonly service: CoachAgendaService) {
    super();
  }

  @Query(() => [DayAvailabilityObjectType])
  async getCoachAvailability(
    @Args('coachAgendaId', { type: () => Number }) coachAgendaId: number,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ): Promise<DayAvailabilityObjectType[]> {
    const coachAgenda = await this.service.findOne(coachAgendaId);
    return this.service.getAvailabilityByMonths(coachAgenda, from, to);
  }
}
