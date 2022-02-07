import { HttpStatus, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import {
  haveCoacheeProfile,
  isInvitedAndWaiting,
} from 'src/coaching/validators/coachee.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { SatReportDto } from 'src/evaluationTests/dto/satReport.dto';
import { SatResultAreaDto } from 'src/evaluationTests/dto/satResult.dto';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { UsersService } from 'src/users/services/users.service';

@Resolver(() => SatReport)
@UseGuards(JwtAuthGuard)
export class SatReportsResolver extends BaseResolver(SatReport, {
  create: SatReportDto,
  update: SatReportDto,
}) {
  constructor(
    protected readonly service: SatReportsService,
    private userService: UsersService,
    private reportEvaluationService: SatReportEvaluationService,
  ) {
    super();
  }

  @Mutation(() => SatReport, { name: 'createSatReport' })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => SatReportDto })
    data: SatReportDto,
  ): Promise<SatReport> {
    const hostUser = await this.userService.findOne(session.userId, {
      relations: ['coachee'],
    });
    // TODO Validate how many SatReport can create
    // TODO Assing Coaching Areas to Coachee, according to Sat Result

    if (!haveCoacheeProfile(hostUser)) {
      throw new MindfitException({
        error: 'The user does not have a profile as a coachee.',
        errorCode: `USER_WITHOUT_COACHEE_PROFILE`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (isInvitedAndWaiting(hostUser)) {
      throw new MindfitException({
        error: 'The user has a pending invitation as a coachee.',
        errorCode: `PENDING_COACHEE_INVITATION`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Todo Validate Sat, sections, questions and answers relations and limits

    const satReport = await this.service.createFullReport(hostUser, data);
    return satReport;
  }

  @ResolveField('result', () => [SatResultAreaDto])
  async result(@Parent() { id }: SatReport): Promise<SatResultAreaDto[]> {
    const result = await this.reportEvaluationService.getSatResult(id);
    return result;
  }
}
