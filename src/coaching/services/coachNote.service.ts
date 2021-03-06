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
import { User } from 'src/users/models/users.model';
import { Roles } from 'src/users/enums/roles.enum';
import { EditCoachNoteDto } from 'src/coaching/dto/coachNote.dto';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';

@Injectable()
export class CoachNoteService extends BaseService<CoachNote> {
  constructor(
    protected repository: CoachNoteRepository,
    private usersService: UsersService,
    private coacheesService: CoacheeService,
  ) {
    super();
  }

  async createCoachNote(
    session: UserSession,
    data: CoachNoteDto,
  ): Promise<CoachNote> {
    const hostUser: User = await this.usersService.findOne({
      id: session.userId,
      relations: {
        ref: 'user',
        relations: [['user.coach', 'coach']],
      },
    });
    const assignedCoachees: Coachee[] =
      await this.coacheesService.findCoacheesByCoachId(hostUser?.coach?.id);

    if (!assignedCoachees.length && hostUser.role === Roles.COACH) {
      throw new MindfitException({
        error: 'You do not have any coachees assigned to you.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.NOT_EXISTING_COCHEES,
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
        errorCode: CoacheeErrors.NOT_ASSIGNED_COCHEE,
      });
    }

    const coachNoteData: Partial<CoachNote> = await CoachNoteDto.from(data);
    if (coachNoteData?.coachee?.isSuspended) {
      throw new MindfitException({
        error: 'You can not create a note for a suspended coachee',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.SUSPENDED_COACHEE,
      });
    }
    const { coach } = hostUser;

    if (coachNoteData && coach) {
      const coachNote: CoachNote = await this.repository.create({
        ...coachNoteData,
        coach,
      });
      return this.repository.findOneBy({ id: coachNote.id });
    }
  }

  async updateCoachNote(
    session: UserSession,
    coachNoteId: number,
    data: EditCoachNoteDto,
  ): Promise<CoachNote> {
    const [hostUser, coachNote] = await Promise.all([
      this.usersService.findOne({
        id: session.userId,
        relations: {
          ref: 'user',
          relations: [['user.coach', 'coach']],
        },
      }),
      this.findOne({
        id: coachNoteId,
        relations: {
          ref: 'coachNote',
          relations: [['coachNote.coach', 'coach']],
        },
      }),
    ]);

    if (!coachNote) {
      throw new MindfitException({
        error: 'Coach Note not found',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.COACH_NOTE_NOT_FOUND,
      });
    }

    if (
      coachNote.coach.id !== hostUser.coach.id &&
      hostUser.role === Roles.COACH
    ) {
      throw new MindfitException({
        error: 'You are not allowed to update this coach note',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.COACH_NOTE_NOT_ALLOWED_TO_UPDATE,
      });
    }

    return this.update(coachNoteId, data);
  }

  async deleteCoachNote(
    session: UserSession,
    coachNoteId: number,
  ): Promise<CoachNote> {
    const [hostUser, coachNote] = await Promise.all([
      this.usersService.findOne({
        id: session.userId,
        relations: {
          ref: 'user',
          relations: [['user.coach', 'coach']],
        },
      }),
      this.findOne({
        id: coachNoteId,
        relations: {
          ref: 'coachNote',
          relations: [['coachNote.coach', 'coach']],
        },
      }),
    ]);

    if (!coachNote) {
      throw new MindfitException({
        error: 'Coach Note not found',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.COACH_NOTE_NOT_FOUND,
      });
    }
    if (
      hostUser.role === Roles.COACH &&
      coachNote?.coach?.id !== hostUser?.coach?.id
    ) {
      throw new MindfitException({
        error: 'You are not allowed to delete this coach note',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.COACH_NOTE_NOT_ALLOWED_TO_DELETE,
      });
    }
    await this.delete(coachNoteId);
    return coachNote;
  }
}
