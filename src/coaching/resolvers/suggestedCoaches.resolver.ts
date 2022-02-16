import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { RejectSuggestedCoachesDto } from 'src/coaching/dto/suggestedCoaches.dto';
import { CoachingErrorEnum } from 'src/coaching/enums/coachingErrors.enum';
import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { haveCoacheeProfile } from 'src/coaching/validators/coachee.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/users/enums/roles.enum';
import { UsersService } from 'src/users/services/users.service';

@Resolver(() => SuggestedCoaches)
@UseGuards(JwtAuthGuard)
export class SuggestedCoachesResolver {
  constructor(
    private service: SuggestedCoachesService,
    private userService: UsersService,
  ) {}

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => SuggestedCoaches)
  async getRandomSuggestedCoaches(@CurrentSession() session: UserSession) {
    const hostUser = await this.userService.findOne(session.userId);
    if (!haveCoacheeProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coachee profile',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingErrorEnum.NO_COACHEE_PROFILE,
      });
    }

    return this.service.getRandomSuggestedCoaches(hostUser.coachee.id);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => SuggestedCoaches)
  async rejectSuggestedCoaches(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => RejectSuggestedCoachesDto })
    data: RejectSuggestedCoachesDto,
  ) {
    const hostUser = await this.userService.findOne(session.userId);

    if (!haveCoacheeProfile(hostUser)) {
      throw new MindfitException({
        error: 'You do not have a Coachee profile',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingErrorEnum.NO_COACHEE_PROFILE,
      });
    }
    return this.service.rejectSuggestedCoaches(data);
  }
}
