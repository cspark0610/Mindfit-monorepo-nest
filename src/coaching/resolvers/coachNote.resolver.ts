import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CoachNoteDto } from 'src/coaching/dto/coachNote.dto';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Roles } from 'src/users/enums/roles.enum';
import { CoachNoteService } from '../services/coachNote.service';
import { EditCoachNoteDto } from '../dto/coachNote.dto';

@Resolver(() => CoachNote)
@UseGuards(JwtAuthGuard)
export class CoachNoteResolver extends BaseResolver(CoachNote, {
  create: CoachNoteDto,
  update: CoachNoteDto,
}) {
  constructor(protected readonly service: CoachNoteService) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACH))
  @Mutation(() => CoachNote, { name: `createCoachNote` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CoachNoteDto })
    data: CoachNoteDto,
  ): Promise<CoachNote> {
    return this.service.createCoachNote(session, data);
  }

  @UseGuards(RolesGuard(Roles.COACH, Roles.SUPER_USER))
  @Mutation(() => CoachNote, { name: `updateCoachNote` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('coachNoteId', { type: () => Int }) coachNoteId: number,
    @Args('data', { type: () => EditCoachNoteDto }) data: EditCoachNoteDto,
  ): Promise<CoachNote> {
    return this.service.updateCoachNote(session, coachNoteId, data);
  }

  @UseGuards(RolesGuard(Roles.COACH, Roles.SUPER_USER))
  @Mutation(() => CoachNote, { name: `deleteCoachNote` })
  async delete(
    @CurrentSession() session: UserSession,
    @Args('coachNoteId', { type: () => Int }) coachNoteId: number,
  ): Promise<CoachNote> {
    return this.service.deleteCoachNote(session, coachNoteId);
  }
}
