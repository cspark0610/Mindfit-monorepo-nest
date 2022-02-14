import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
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
import { CoachService } from 'src/coaching/services/coach.service';
import { Coach } from 'src/coaching/models/coach.model';

@Resolver(() => CoachAgenda)
export class CoachAgendaResolver extends BaseResolver(CoachAgenda, {
  create: CreateCoachAgendaDto,
  update: EditCoachAgendaDto,
}) {
  constructor(
    protected readonly service: CoachAgendaService,
    private readonly coachService: CoachService,
  ) {
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
  //@RolesGuard(Roles.SUPER_USER)
  async create(
    @Args('data', { type: () => CreateCoachAgendaDto })
    data: CreateCoachAgendaDto,
  ): Promise<CoachAgenda> {
    const createCoachAgendaDto = await CreateCoachAgendaDto.from(data);

    const coach: Coach = await this.coachService.findOneBy({
      id: data.coachId,
    });

    return this.service.createCoachAgendaWithCoach(createCoachAgendaDto, coach);
  }
}
