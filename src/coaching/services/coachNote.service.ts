import { HttpStatus, Injectable } from '@nestjs/common';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { CoachNoteRepository } from 'src/coaching/repositories/coachNote.repository';
import { BaseService } from 'src/common/service/base.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachNoteDto } from 'src/coaching/dto/coachNote.dto';
import { UsersService } from 'src/users/services/users.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { coachNoteErrors } from '../enums/coachNoteErrors.enum';
import { User } from 'src/users/models/users.model';
import { Roles } from 'src/users/enums/roles.enum';
import { EditCoachNoteDto } from '../dto/coachNote.dto';

@Injectable()
export class CoachNoteService extends BaseService<CoachNote> {
  constructor(
    protected repository: CoachNoteRepository,
    private usersService: UsersService,
    private coacheesService: CoacheeService,
  ) {
    super();
  }

  async createCoachNoteWithCoachAndCocheeRelation(
    session: UserSession,
    data: CoachNoteDto,
  ): Promise<CoachNote> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const assignedCoachees: Coachee[] =
      await this.coacheesService.findCoacheesByCoachId(hostUser.coach.id);

    if (!assignedCoachees.length && hostUser.role === Roles.COACH) {
      throw new MindfitException({
        error: 'You do not have any coachees assigned to you.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachNoteErrors.NOT_EXISTING_COCHEES,
      });
    }
    const assignedCoacheeIds: number[] = assignedCoachees.map(
      (coachee) => coachee.id,
    );
    if (
      !assignedCoacheeIds.includes(data.coacheeId) &&
      hostUser.role === Roles.COACH
    ) {
      throw new MindfitException({
        error: 'You are not assigned to this coachee',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachNoteErrors.NOT_ASSIGNED_COCHEE,
      });
    }

    const coachNoteData = await CoachNoteDto.from(data);
    if (coachNoteData?.coachee?.isSuspended) {
      throw new MindfitException({
        error: 'You can not create a note for a suspended coachee',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachNoteErrors.SUSPENDED_COACHEE,
      });
    }

    const { coachee } = coachNoteData;
    const { coach } = hostUser;

    if (coachNoteData && coach && coachee) {
      const coachNote = await this.repository.create(data);
      await Promise.all([
        this.repository.relationCoachNoteWithCoach(coachNote, coach),
        this.repository.relationCoachNoteWithCoachee(coachNote, coachee),
      ]);

      return this.repository.findOneBy({ id: coachNote.id });
    }
  }

  async updateCoachNote(
    session: UserSession,
    coachNoteId: number,
    data: EditCoachNoteDto,
  ): Promise<CoachNote> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const coachNote: CoachNote = await this.repository.getCoachNoteById(
      coachNoteId,
    );
    if (!coachNote) {
      throw new MindfitException({
        error: 'Coach Note not found',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachNoteErrors.NOT_FOUND,
      });
    }
    if (
      coachNote.coach.id !== hostUser.coach.id &&
      hostUser.role === Roles.COACH
    ) {
      throw new MindfitException({
        error: 'You are not allowed to update this coach note',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachNoteErrors.NOT_ALLOWED_TO_UPDATE,
      });
    }

    return this.update(coachNoteId, data);
  }

  async deleteCoachNote(
    session: UserSession,
    coachNoteId: number,
  ): Promise<CoachNote> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const coachNote: CoachNote = await this.repository.getCoachNoteById(
      coachNoteId,
    );
    if (!coachNote) {
      throw new MindfitException({
        error: 'Coach Note not found',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachNoteErrors.NOT_FOUND,
      });
    }
    if (
      hostUser.role === Roles.COACH &&
      coachNote?.coach?.id !== hostUser?.coach?.id
    ) {
      throw new MindfitException({
        error: 'You are not allowed to delete this coach note',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: coachNoteErrors.NOT_ALLOWED_TO_DELETE,
      });
    }
    await this.delete(coachNoteId);
    return coachNote;
  }
}
