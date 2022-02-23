import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
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
@Resolver(() => Coachee)
@UseGuards(JwtAuthGuard)
export class CoacheesResolver extends BaseResolver(Coachee, {
  create: CoacheeDto,
  update: EditCoacheeDto,
}) {
  constructor(protected readonly service: CoacheeService) {
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
