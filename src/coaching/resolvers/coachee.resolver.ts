import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
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
import { ActionDto } from 'src/coaching/dto/action.dto';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { DimensionAverages } from 'src/evaluationTests/models/dimensionAverages.model';

@Resolver(() => Coachee)
@UseGuards(JwtAuthGuard)
export class CoacheesResolver extends BaseResolver(Coachee, {
  create: CoacheeDto,
  update: EditCoacheeDto,
}) {
  constructor(
    protected readonly service: CoacheeService,
    private historicalAssigmentService: HistoricalAssigmentService,
  ) {
    super();
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER))
  @Mutation(() => Coachee, { name: `createCoachee` })
  async create(
    @Args('data', { type: () => CoacheeDto }) coacheeData: CoacheeDto,
  ): Promise<Coachee> {
    // SE ASUME QUE UNICAMENTE LOS USERS CON ROL SUPER_USER PUEDEN CREAR COACHEES QUE SEAN OWNERS DE UNA ORG
    return this.service.createCoachee(coacheeData);
  }

  @UseGuards(RolesGuard(Roles.COACHEE, Roles.STAFF, Roles.SUPER_USER))
  @Mutation(() => Coachee, { name: `updateCoachee` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
    @Args('data', { type: () => EditCoacheeDto }) data: EditCoacheeDto,
  ): Promise<Coachee> {
    return this.service.updateCoachee(session, coacheeId, data);
  }

  @Mutation(() => Coachee, { name: `inviteCoachee` })
  async inviteCoachee(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => InviteCoacheeDto }) data: InviteCoacheeDto,
  ): Promise<Coachee> {
    return this.service.inviteCoachee(session.userId, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Coachee, { name: `acceptInvitation` })
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
  @Mutation(() => Coachee, { name: `selectCoach` })
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

  @UseGuards(RolesGuard(Roles.COACHEE, Roles.SUPER_USER))
  @Mutation(() => Coachee, { name: `SuspendOrActivateCoachee` })
  async suspendOrActivateCoachee(
    @CurrentSession() session: UserSession,
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
    @Args('data', { type: () => ActionDto }) data: ActionDto,
  ): Promise<Coachee> {
    const { type } = data;
    const { userId } = session;
    return this.service.suspendOrActivateCoachee(userId, coacheeId, type);
  }

  //query para consultar todos las rows de HistoricalAssigment por coacheeId
  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => [HistoricalAssigment], {
    name: `getAllHistoricalAssigmentsByCoacheeId`,
  })
  async getAllHistoricalAssigmentsByCoacheeId(
    @CurrentSession() session: UserSession,
  ) {
    return this.historicalAssigmentService.getAllHistoricalAssigmentsByCoacheeId(
      session,
    );
  }

  @ResolveField('dimensionAverages', () => [DimensionAverages], {
    nullable: true,
  })
  async dimensionAverages(@Parent() coachee: Coachee) {
    return this.service.getCoacheeDimensionAverages(coachee.id);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Coachee, { name: `updateCoacheeFile` })
  async updateCoacheeFile(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => EditCoacheeDto }) data: EditCoacheeDto,
  ): Promise<Coachee> {
    return this.service.updateCoacheeFile(session, data);
  }
}
