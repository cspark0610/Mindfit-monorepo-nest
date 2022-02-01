import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { haveCoachProfile } from 'src/coaching/validators/coach.validators';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateCoachAgendaDayDto,
  EditCoachAgendaDayDto,
} from '../dto/coachAgendaDay.dto';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';
import { coachAgendaDayService } from '../services/coachAgendaDay.service';

@Resolver(() => CoachAgendaDay)
@UseGuards(JwtAuthGuard)
export class CoachAgendaResolver extends BaseResolver(CoachAgendaDay, {
  create: CreateCoachAgendaDayDto,
  edit: EditCoachAgendaDayDto,
}) {
  constructor(protected readonly service: coachAgendaDayService) {
    super();
  }

  @Mutation(() => CoachAgendaDay, { name: `createCoachAgendaDay` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateCoachAgendaDayDto })
    data: CreateCoachAgendaDayDto,
  ): Promise<CoachAgendaDay> {
    const hostUser = await this.userService.findOne(session.userId, {
      relations: ['coach'],
    });

    if (!haveCoachProfile(hostUser)) {
      throw new BadRequestException('The user does not have Coach Profile');
    }

    // TODO user -> coach -> CoachAgenda
    const coachAgenda = hostUser.coach.coachAgenda;
    console.log(coachAgenda);

    return this.service.create({ coachAgenda, ...data });
  }
}
