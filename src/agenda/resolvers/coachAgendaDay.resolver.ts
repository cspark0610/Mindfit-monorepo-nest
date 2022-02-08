import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import dayjs from 'dayjs';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { haveCoachProfile } from 'src/coaching/validators/coach.validators';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { UsersService } from 'src/users/services/users.service';
import {
  CreateCoachAgendaDayDto,
  EditCoachAgendaDayDto,
} from '../dto/coachAgendaDay.dto';
import { CoachAgendaDay } from '../models/coachAgendaDay.model';
import { CoachAgendaDayService } from '../services/coachAgendaDay.service';

@Resolver(() => CoachAgendaDay)
@UseGuards(JwtAuthGuard)
export class CoachAgendaDayResolver extends BaseResolver(CoachAgendaDay, {
  create: CreateCoachAgendaDayDto,
  update: EditCoachAgendaDayDto,
}) {
  constructor(
    protected readonly service: CoachAgendaDayService,
    private userService: UsersService,
  ) {
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

    const date = dayjs(data.day);

    if (date.isBefore(dayjs(), 'minute')) {
      throw new BadRequestException('You cannot set days before today');
    }

    if (!haveCoachProfile(hostUser)) {
      throw new BadRequestException('The user does not have Coach Profile');
    }
    const coachAgenda = hostUser.coach.coachAgenda;

    const dayConfig = await this.service.getDayConfig(coachAgenda, data.day);

    if (dayConfig.length > 0) {
      throw new BadRequestException(
        'This day has already been set. Use update instead.',
      );
    }

    return this.service.create({ coachAgenda, ...data });
  }

  @Mutation(() => CoachAgendaDay, { name: `updateCoachAgendaDay` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Number }) id: number,
    @Args('data', { type: () => EditCoachAgendaDayDto })
    data: CreateCoachAgendaDayDto,
  ): Promise<CoachAgendaDay | CoachAgendaDay[]> {
    const hostUser = await this.userService.findOne(session.userId, {
      relations: ['coach'],
    });

    if (!haveCoachProfile(hostUser)) {
      throw new BadRequestException('The user does not have Coach Profile');
    }

    return this.service.update(id, data);
  }
}
