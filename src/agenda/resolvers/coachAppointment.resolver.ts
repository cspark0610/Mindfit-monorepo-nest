import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { Roles } from 'src/users/enums/roles.enum';
import { UsersService } from 'src/users/services/users.service';
import {
  CreateCoachAppointmentDto,
  EditCoachAppointmentDto,
  RequestCoachAppointmentDto,
  PostponeCoachAppointmentDto,
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
    private coachAgendaService: CoachAgendaService,
    private coacheeService: CoacheeService,
    private coreConfigService: CoreConfigService,
    private coachAppointmentValidator: CoachAppointmentValidator,
    private userService: UsersService,
  ) {
    super();
  }

  /**
   * Actor: Coach
   * function: Create an Appointment to a assinged Coachee
   */

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachAppointment, { name: `createCoachAppointment` })
  protected async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateCoachAppointmentDto })
    data: CreateCoachAppointmentDto,
  ): Promise<CoachAppointment> {
    const coachAppointmentData = await CreateCoachAppointmentDto.from(data);

    return this.service.createAppointment(session.userId, coachAppointmentData);
  }

  /**
   * Actor: Coachee
   * Function: Create an Appointment to be confirmed by a Coach, automatically confirmed by the coachee
   */
  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => CoachAppointment)
  async requestAppointment(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => RequestCoachAppointmentDto })
    data: RequestCoachAppointmentDto,
  ) {
    return this.service.requestAppointment(session.userId, data);
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachAppointment)
  async coachPostponeAppointment(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => PostponeCoachAppointmentDto })
    data: PostponeCoachAppointmentDto,
  ): Promise<CoachAppointment> {
    return this.service.coachPostponeAppointment(
      session.userId,
      data.appointmentId,
      data.startDate,
      data.endDate,
    );
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => CoachAppointment)
  async coacheePostponeAppointment(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => PostponeCoachAppointmentDto })
    data: PostponeCoachAppointmentDto,
  ): Promise<CoachAppointment> {
    return this.service.coacheePostponeAppointment(
      session.userId,
      data.appointmentId,
      data.startDate,
      data.endDate,
    );
  }

  /**
   * Actor: Coach
   * Function: Allow to coach to confirm an Appointment
   */
  @Mutation(() => CoachAppointment)
  async CoachConfirmAppointment(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.service.coachConfirmAppointment(session.userId, id);
  }
}
