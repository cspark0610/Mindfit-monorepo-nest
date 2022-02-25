import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CoachNoteDto } from 'src/coaching/dto/coachNote.dto';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { coachNoteErrors } from '../enums/coachNoteErrors.enum';
import { UsersService } from 'src/users/services/users.service';
import { CoachNoteService } from '../services/coachNote.service';
import { Coach } from 'src/coaching/models/coach.model';

@Resolver(() => CoachNote)
@UseGuards(JwtAuthGuard)
export class CoachNoteResolver extends BaseResolver(CoachNote, {
  create: CoachNoteDto,
  update: CoachNoteDto,
}) {
  constructor(
    protected readonly service: CoachNoteService,
    private usersService: UsersService,
  ) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACH, Roles.SUPER_USER))
  @Mutation(() => CoachNote, { name: `createCoachNote` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CoachNoteDto })
    data: CoachNoteDto,
  ): Promise<CoachNote> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const assignedCoachees: Coachee[] = hostUser.coach.assignedCoachees;
    const assignedCoacheeIds: number[] = assignedCoachees.map(
      (coachee) => coachee.id,
    );
    //preguntar si es necesario  pasar el from
    const coachNoteData = await CoachNoteDto.from(data);
    const coach: Coach = hostUser.coach;
    const coachee: Coachee = (await this.usersService.findOne(data.coacheeId))
      .coachee;

    if (assignedCoachees.length === 0) {
      throw new MindfitException({
        error: 'You do not have any coachees assigned to you.',
        errorCode: coachNoteErrors.NOT_EXISTING_COCHEES,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (!assignedCoacheeIds.includes(data.coacheeId)) {
      throw new MindfitException({
        error: 'You are not assigned to this coachee',
        errorCode: coachNoteErrors.NOT_ASSIGNED_COCHEE,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return this.service.createCoachNoteWithCoachAndCocheeRelation(
      coachNoteData,
      coach,
      coachee,
    );
  }
}
