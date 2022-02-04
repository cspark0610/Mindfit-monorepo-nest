import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { haveCoacheeProfile } from 'src/coaching/validators/coachee.validators';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { UsersService } from 'src/users/services/users.service';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
  CreateCoachAppointmentDto,
  EditCoachAppointmentDto,
  RequestCoachAppointmentDto,
} from '../dto/coachAppointment.dto';
import { CoachAppointment } from '../models/coachAppointment.model';
import { CoachAppointmentService } from '../services/coachAppointment.service';

@Resolver(() => CoachAppointment)
@UseGuards(JwtAuthGuard)
export class CoachAppointmentsResolver extends BaseResolver(CoachAppointment, {
  create: CreateCoachAppointmentDto,
  update: EditCoachAppointmentDto,
}) {
  constructor(
    protected readonly service: CoachAppointmentService,
    private userService: UsersService,
  ) {
    super();
  }

  @Mutation(() => CoachAppointment)
  async requestAppointment(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => RequestCoachAppointmentDto })
    data: RequestCoachAppointmentDto,
  ) {
    const hostUser = await this.userService.findOne(session.userId, {
      relations: ['coachee'],
    });

    if (!haveCoacheeProfile(hostUser)) {
      throw new BadRequestException('You do not have a Coachee profile');
    }

    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const coacheeAppointments = await this.service.findAll({
      where: {
        coachee: hostUser.coachee,
        date: MoreThanOrEqual(firstDay) && LessThanOrEqual(lastDay),
      },
    });

    if (coacheeAppointments.length >= 2) {
      throw new BadRequestException(
        'You have exceeded the limit of appointments per month.',
      );
    }

    // TODO Validate Max Pending Appointments per monht
    // TODO validate Coach Availability

    const result = await this.service.create({
      coachee: hostUser.coachee,
      ...data,
    });
    return result;
  }
}
