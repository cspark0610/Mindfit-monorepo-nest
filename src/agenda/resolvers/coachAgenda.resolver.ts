import { Args, Query, Resolver } from '@nestjs/graphql';
import { ParseDatePipe } from 'src/common/pipes/ParseDatePipe';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateCoachAgendaDto,
  EditCoachAgendaDto,
} from '../dto/coachAgenda.dto';
import { MonthAvailabilityInterface } from '../interfaces/availabilityCalendar.interface';
import { MonthAvailabilityObjectType } from '../models/availabilityCalendar.model';
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

  @Query(() => MonthAvailabilityObjectType)
  async getCoachAvailability(
    @Args('coachAgendaId', { type: () => Number }) coachAgendaId: number,
    @Args('from', { type: () => String }, ParseDatePipe) from: Date,
    @Args('to', { type: () => String }, ParseDatePipe) to: Date,
  ): Promise<MonthAvailabilityInterface[]> {
    console.log(from);
    console.log(to);

    const coachAgenda = await this.service.findOne(coachAgendaId);
    return this.service.getAvailabilityByMonths(coachAgenda, from, to);
  }
}
