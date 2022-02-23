import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { Coachee } from 'src/coaching/models/coachee.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CoacheeDto,
  EditCoacheeDto,
  InviteCoacheeDto,
} from 'src/coaching/dto/coachee.dto';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/enums/roles.enum';
import { SelectCoachDTO } from 'src/coaching/dto/suggestedCoaches.dto';
import { CoacheeRegistrationStatus } from 'src/coaching/enums/coacheeRegistrationStatus.enum';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/models/users.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoacheeEditErrors } from 'src/coaching/enums/coacheeEditErrors.enum';
@Resolver(() => Coachee)
@UseGuards(JwtAuthGuard)
export class CoacheesResolver extends BaseResolver(Coachee, {
  create: CoacheeDto,
  update: EditCoacheeDto,
}) {
  constructor(
    protected readonly service: CoacheeService,
    private userService: UsersService,
  ) {
    super();
  }

  @Mutation(() => Coachee, { name: `createCoachee` })
  //se le saco el protected para poder ser accesible desde el test
  async create(
    @Args('data', { type: () => CoacheeDto }) data: CoacheeDto,
  ): Promise<Coachee> {
    const coacheeData = await CoacheeDto.from(data);
    return this.service.create(coacheeData);
  }

  @UseGuards(RolesGuard(Roles.COACHEE, Roles.STAFF, Roles.SUPER_USER))
  @Mutation(() => Coachee, { name: `updateCoachee` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
    @Args('data', { type: () => EditCoacheeDto }) data: CoacheeDto,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const coachee: Coachee = await this.service.findOne(coacheeId);
    const coacheeData = await CoacheeDto.from(data);

    if (
      hostUser.role === Roles.COACHEE &&
      !hostUser.coachee.organization &&
      !hostUser.coachee.isAdmin
    ) {
      throw new MindfitException({
        error:
          'You cannot edit a Coachee because you do not own or admin an organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeEditErrors.NOT_OWNER_ORGANIZATION_EDIT_COACHEE,
      });
    }

    if (
      hostUser.role === Roles.COACHEE &&
      coachee.organization.id !== hostUser.coachee.organization.id
    ) {
      throw new MindfitException({
        error:
          'You cannot edit this Coachee because he/she does not belong to your organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeEditErrors.COACHEE_FROM_ANOTHER_ORGANIZATION,
      });
    }
    return this.service.update(coachee.id, coacheeData);
  }

  @Mutation(() => Coachee)
  async inviteCoachee(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => InviteCoacheeDto }) data: InviteCoacheeDto,
  ): Promise<Coachee> {
    return this.service.inviteCoachee(session.userId, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Coachee)
  async acceptInvitation(
    @CurrentSession() session: UserSession,
  ): Promise<Coachee | Coachee[]> {
    return this.service.acceptInvitation(session.userId);
  }

  //Temporal, para probar solicitar un appointment
  @UseGuards(RolesGuard(Roles.STAFF, Roles.SUPER_USER))
  @Mutation(() => Coachee)
  async assignCoach(
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
    @Args('coachId', { type: () => Int }) coachId: number,
  ) {
    const coach = await this.coachService.findOne(coachId);

    return this.service.update(coachId, { assignedCoach: coach });
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Coachee)
  async selectCoach(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => SelectCoachDTO }) data: SelectCoachDTO,
  ): Promise<Coachee> {
    return this.service.selectCoach(
      session.userId,
      data.coachId,
      data.suggestedCoachId,
    );
  }

  @ResolveField('registrationStatus', () => CoacheeRegistrationStatus)
  async registrationStatus(@Parent() { id }: Coachee) {
    return this.service.getCoacheeRegistrationStatus(id);
  }
}
