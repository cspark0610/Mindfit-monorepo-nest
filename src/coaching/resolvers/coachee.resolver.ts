import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
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
  protected async create(
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

  @Mutation(() => Coachee)
  async acceptInvitation(
    @CurrentSession() session: UserSession,
  ): Promise<Coachee | Coachee[]> {
    return this.service.acceptInvitation(session.userId);
  }

  // @Query(() => [Coach])
  // async getSuggestedCoaches(
  //   @CurrentSession() session: UserSession,
  // ): Promise<Coach> {
  //   const hostUser = await this.userService.findOne(session.userId);
  //   const lastSatRealized = await this.satReportService.getLastSatReportByUser(
  //     hostUser.id,
  //   );

  //   if (!hostUser?.coachee) {
  //     throw new MindfitException({
  //       error: `The user do not have coachee profile.`,
  //       errorCode: 'COACHEE_NOT_INVITED',
  //       statusCode: HttpStatus.BAD_REQUEST,
  //     });
  //   }
  // }

  //Temporal, para probar solicitar un appointment
  @Mutation(() => Coachee)
  async assignCoach(
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
    @Args('coachId', { type: () => Int }) coachId: number,
  ) {
    const coach = await this.coachService.findOne(coachId);

    return this.service.update(coachId, { assignedCoach: coach });
  }
}
