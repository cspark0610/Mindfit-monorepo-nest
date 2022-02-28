import { Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { BaseService } from 'src/common/service/base.service';
import {
  isOrganizationAdmin,
  ownOrganization,
} from 'src/users/validators/users.validators';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Emails } from 'src/strapi/enum/emails.enum';
import { AwsSesService } from 'src/aws/services/ses.service';
import { UsersService } from 'src/users/services/users.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { InviteCoacheeDto } from 'src/coaching/dto/coachee.dto';
import { Organization } from 'src/organizations/models/organization.model';
import { Roles } from 'src/users/enums/roles.enum';
import { SuggestedCoachErrors } from 'src/coaching/enums/suggestedCoachesErros.enum';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { CoacheeRegistrationStatus } from 'src/coaching/enums/coacheeRegistrationStatus.enum';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { HistoricalCoacheeData } from 'src/coaching/models/historicalCoacheeData.model';
import { suspendCoacheeByOrganization } from 'src/coaching/enums/suspendCoacheeByOrganization.enum';
import { actionType } from 'src/coaching/enums/actionType.enum';
import { User } from 'src/users/models/users.model';
import { activateCoacheeByOrganization } from '../enums/activateCoacheeByOrganization.enum';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { CoacheeEditErrors } from 'src/coaching/enums/coacheeEditErrors.enum';
import { EditCoacheeDto } from 'src/coaching/dto/coachee.dto';

@Injectable()
export class CoacheeService extends BaseService<Coachee> {
  constructor(
    protected readonly repository: CoacheeRepository,
    private sesService: AwsSesService,
    private userService: UsersService,
    @Inject(forwardRef(() => SuggestedCoachesService))
    private suggestedCoachesService: SuggestedCoachesService,
    private satReportService: SatReportsService,
    @Inject(forwardRef(() => CoachAppointmentService))
    private coachAppointmentService: CoachAppointmentService,
  ) {
    super();
  }

  async getCoacheeRegistrationStatus(id: number) {
    const coachee = await this.findOne(id);

    if (coachee.invited && !coachee.invitationAccepted) {
      return CoacheeRegistrationStatus.INVITATION_PENDING;
    }

    // TODO Validar cuando tengamos una foto por defecto
    // if (!coachee.profilePicture) {
    //   return CoacheeRegistrationStatus.PROFILE_UPDATE_PENDING;
    // }

    const appointment = await this.coachAppointmentService.findOneBy({
      coachee,
    });

    if (appointment) {
      return CoacheeRegistrationStatus.REGISTRATION_COMPLETED;
    }

    if (coachee.assignedCoach) {
      return CoacheeRegistrationStatus.COACH_APPOINTMENT_PENDING;
    }

    const satReport = await this.satReportService.getLastSatReportByUser(
      coachee.user.id,
    );

    if (satReport) {
      return CoacheeRegistrationStatus.COACH_SELECTION_PENDING;
    }

    if (!satReport) {
      return CoacheeRegistrationStatus.SAT_PENDING;
    }
  }

  async updateCoachee(
    session: UserSession,
    coacheeId: number,
    data: EditCoacheeDto,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const coachee: Coachee = await this.findOne(coacheeId);

    if (!coachee) {
      throw new MindfitException({
        error: 'Not found coachee',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: CoacheeEditErrors.NOT_FOUND_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      !hostUser?.coachee?.organization?.id &&
      !hostUser?.coachee?.isAdmin
    ) {
      throw new MindfitException({
        error:
          'You cannot edit a Coachee because you do not own or admin an organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeEditErrors.NOT_OWNER_ORGANIZATION_EDIT_COACHEE,
      });
    }

    if (
      hostUser.role === Roles.COACHEE &&
      coachee?.organization?.id !== hostUser?.coachee?.organization?.id
    ) {
      throw new MindfitException({
        error:
          'You cannot edit this Coachee because he/she does not belong to your organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeEditErrors.COACHEE_FROM_ANOTHER_ORGANIZATION,
      });
    }

    return this.update(coachee.id, data);
  }

  async inviteCoachee(
    userId: number,
    data: InviteCoacheeDto,
  ): Promise<Coachee> {
    const hostUser = await this.userService.findOne(userId);

    if (!ownOrganization(hostUser) && !isOrganizationAdmin(hostUser)) {
      throw new MindfitException({
        error:
          'You do not have permissions to perform this action or you do not own an organization',
        errorCode: 'UNAUTHORIZED',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    const { user: userData, ...coacheeData } = data;
    coacheeData.invited = true;

    // Get User organization
    const organization: Organization = ownOrganization(hostUser)
      ? hostUser.organization
      : hostUser.coachee.organization;

    const { user } = await this.userService.createInvitedUser(
      userData,
      Roles.COACHEE,
    );
    try {
      const coachee = await this.create({
        user,
        organization,
        ...coacheeData,
      });

      const hashResetPassword = hashSync(
        Math.random().toString(36).slice(-12),
        genSaltSync(),
      );

      await Promise.all([
        this.userService.update(user.id, {
          hashResetPassword,
        }),
        this.sesService.sendEmail(
          {
            template: Emails.INVITE_COLLABORATOR,
            to: [user.email],
            subject: `${hostUser.name} te ha invitado a Mindfit`,
          },
          { code: hashResetPassword },
        ),
      ]);

      return coachee;
    } catch (error) {
      console.log('\nCoacheesResolver - ERROR INVITING USER:\n', error);
      await this.userService.delete(user.id);
    }
  }

  async acceptInvitation(userId: number): Promise<Coachee> {
    const user = await this.userService.findOne(userId);
    if (!user.coachee) {
      throw new MindfitException({
        error: `The user does not have a coachee profile`,
        errorCode: 'BAD_REQUEST',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (user.role != Roles.COACHEE) {
      throw new MindfitException({
        error: `The coachee profile does not have a COACHEE role.`,
        errorCode: 'BAD_REQUEST',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (!user.coachee?.invited) {
      throw new MindfitException({
        error: `Coachee id ${user.coachee.id} has no invitation.`,
        errorCode: 'COACHEE_NOT_INVITED',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    await this.update(user.coachee.id, { invitationAccepted: true });
    return user.coachee;
  }

  async selectCoach(
    userId: number,
    coachId: number,
    suggestedCoachId: number,
  ): Promise<Coachee> {
    const user = await this.userService.findOne(userId);
    if (!user.coachee) {
      throw new MindfitException({
        error: `The user does not have a coachee profile`,
        errorCode: 'BAD_REQUEST',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (user.coachee.assignedCoach) {
      throw new MindfitException({
        error: 'You already has a Coach Assigned.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: SuggestedCoachErrors.COACHEE_ALREADY_HAS_COACH,
      });
    }

    const suggestedCoaches = await this.suggestedCoachesService.findOne(
      suggestedCoachId,
    );
    const selectedCoach = suggestedCoaches.coaches.find(
      (coach) => coach.id == coachId,
    );

    if (!selectedCoach) {
      throw new MindfitException({
        error: 'The Coach is not in suggestion',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: SuggestedCoachErrors.COACH_NOT_SUGGESTED,
      });
    }

    return this.update(user.coachee.id, {
      assignedCoach: selectedCoach,
    });
  }

  async getHistoricalCoacheeData(
    coachId: number,
  ): Promise<HistoricalCoacheeData> {
    const coachees: Coachee[] =
      await this.repository.getHistoricalDataQueryBuilder(coachId);

    return {
      coachees: coachees,
      coachingAppointments: coachees.flatMap(
        (coachee) => coachee.coachAppointments,
      ),
      coacheeEvaluations: coachees.flatMap(
        (coachee) => coachee.coacheeEvaluations,
      ),
    };
  }

  async getCoacheeByUserEmail(email: string): Promise<Coachee> {
    return this.repository.getCoacheeByUserEmail(email);
  }

  async suspendOrActivateCoachee(
    userId: number,
    coacheeId: number,
    type: string,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(userId);
    const coachee: Coachee = await this.findOne(coacheeId);
    if (!coachee) {
      throw new MindfitException({
        error:
          type === actionType.SUSPEND
            ? 'Coachee not found to suspend'
            : 'Coachee not found to activate',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode:
          type === actionType.SUSPEND
            ? suspendCoacheeByOrganization.NOT_FOUND_COACHEE
            : activateCoacheeByOrganization.NOT_FOUND_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      !hostUser?.coachee?.organization?.id &&
      !hostUser?.coachee?.isAdmin
    ) {
      throw new MindfitException({
        error:
          type === actionType.SUSPEND
            ? 'You cannot suspend a Coachee because you do not own or admin an organization'
            : 'You cannot activate a Coachee because you do not own or admin an organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode:
          type === actionType.SUSPEND
            ? suspendCoacheeByOrganization.NOT_OWNER_ORGANIZATION_SUSPEND_COACHEE
            : activateCoacheeByOrganization.NOT_OWNER_ORGANIZATION_ACTIVATE_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      coachee?.organization?.id !== hostUser?.coachee?.organization?.id
    ) {
      throw new MindfitException({
        error:
          type === actionType.SUSPEND
            ? 'You cannot suspend this Coachee because he/she does not belong to your organization'
            : 'You cannot activate this Coachee because he/she does not belong to your organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode:
          type === actionType.SUSPEND
            ? suspendCoacheeByOrganization.COACHEE_FROM_ANOTHER_ORGANIZATION
            : activateCoacheeByOrganization.COACHEE_FROM_ANOTHER_ORGANIZATION,
      });
    }
    if (type === actionType.SUSPEND && coachee.isSuspended) {
      throw new MindfitException({
        error: 'Coachee is already suspended',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: suspendCoacheeByOrganization.COACHEE_ALREADY_SUSPENDED,
      });
    }
    if (type === actionType.ACTIVATE && coachee.isActive) {
      throw new MindfitException({
        error: 'Coachee is already active',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: activateCoacheeByOrganization.COACHEE_ALREADY_ACTIVE,
      });
    }
    const updateData =
      type === actionType.SUSPEND
        ? { isSuspended: true, isActive: false }
        : { isSuspended: false, isActive: true };
    return this.update(coacheeId, updateData);
  }

  async findCoacheesByCoachId(coachId: number): Promise<Coachee[]> {
    return this.repository.findCoacheesByCoachId(coachId);
  }
}
