import { BadRequestException, UseGuards } from '@nestjs/common';
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
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { UsersService } from 'src/users/services/users.service';
import { getSatResult } from '../common/functions/satReportEvaluation';
import { SatReportDto } from '../dto/satReport.dto';
import { SatResultDto } from '../dto/satResult.dto';
import { SatReport } from '../models/satReport.model';
import { SatReportsService } from '../services/satReport.service';

@Resolver(() => SatReport)
@UseGuards(JwtAuthGuard)
export class SatReportsResolver extends BaseResolver(SatReport, {
  create: SatReportDto,
  update: SatReportDto,
}) {
  constructor(
    protected readonly service: SatReportsService,
    private userService: UsersService,
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
      throw new BadRequestException('You do not have a Coachee profile');
    }

    if (isInvitedAndWaiting(hostUser)) {
      throw new BadRequestException(
        'The user has a pending invitation as a coachee.',
      );
    }

    // Todo Validate Sat, sections, questions and answers relations and limits

    const satReport = await this.service.createFullReport(hostUser, data);
    return satReport;
  }

  @ResolveField('result', () => SatResultDto)
  result(@Parent() satReport: SatReport) {
    return getSatResult(satReport);
  }
}

// example

// {
//   areas: [
//     {
//       area: 'Alimentacion',
//       areaCodeName: 'feeding',
//       puntuations: [
//         {
//           name: 'Comida chatarra',
//           value: 3,
//         },
//         {
//           name: 'Comida saludable',
//           value: 2.1,
//         },
//       ],
//     },
//     {
//       area: 'Ejercicio',
//       areaCodeName: 'feeding',
//       puntuations: [
//         {
//           name: 'Sedentario',
//           value: 1,
//         },
//         {
//           name: 'Activo',
//           value: 3,
//         },
//       ],
//     },
//   ],
// };
