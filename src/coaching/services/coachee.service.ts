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
import { InviteCoacheeDto, CoacheeDto } from 'src/coaching/dto/coachee.dto';
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
import { EditCoacheeDto } from 'src/coaching/dto/coachee.dto';
import { CreateHistoricalAssigmentDto } from '../dto/historicalAssigment.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { historicalAssigmentErrors } from '../enums/historicalAssigmentError.enum';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { DimensionAverages } from 'src/evaluationTests/models/dimensionAverages.model';
import { CoachingErrorEnum } from 'src/coaching/enums/coachingErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';

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
    private historicalAssigmentService: HistoricalAssigmentService,
    private satReportEvaluationService: SatReportEvaluationService,
  ) {
    super();
  }

  /**
   * Validate that the given user has a Coachee Profile
   * Return the coachee profile if validation pass
   */
  async validateCoacheeProfile(userId: number) {
    const user: User = await this.userService.findOne(userId);

    if (!user.coachee) {
      throw new MindfitException({
        error: `The user does not have a coachee profile`,
        errorCode: CoachingErrorEnum.NO_COACHEE_PROFILE,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return user.coachee;
  }

  /**
   * Validate that the given user has an active Coachee Profile
   * Return the coachee profile if validation pass
   */
  async validateActiveCoacheeProfile(userId: number) {
    const coachee = await this.validateCoacheeProfile(userId);
    if (coachee.isSuspended || !coachee.isActive) {
      throw new MindfitException({
        error: `Coachee Profile Suspended or not active`,
        errorCode: CoacheeErrors.COACHEE_PROFILE_SUSPENDED,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return coachee;
  }

  assignCoachingAreas(coachee: Coachee, coachingAreas: CoachingArea[]) {
    return this.repository.assignCoachingAreas(coachee, coachingAreas);
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
  async createCoachee(data: CoacheeDto): Promise<Coachee> {
    if (!data.organizationId) {
      //se debe pasar un organizationId para relacionar el coachee creado con su organization
      throw new MindfitException({
        error: 'OrganizationId is required',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.ORGANIZATION_ID_REQUIRED,
      });
    }
    const coacheeData = await CoacheeDto.from(data);
    const coachee = await this.repository.create(coacheeData);

    if (coachee && coacheeData.organization) {
      await this.repository.relationCoacheeWithOrganization(
        coachee,
        coacheeData.organization,
      );
    }
    return coachee;
  }

  async updateCoachee(
    session: UserSession,
    coacheeId: number,
    data: EditCoacheeDto,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const owner: User = hostUser?.organization?.owner;
    const coacheeToEdit: Coachee = await this.findOne(coacheeId);

    if (!coacheeToEdit) {
      throw new MindfitException({
        error: 'Not found coachee',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: CoacheeErrors.NOT_FOUND_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      coacheeToEdit.id != hostUser.coachee.id
    ) {
      if (hostUser.id !== owner.id) {
        throw new MindfitException({
          error:
            'You cannot edit a Coachee because you are not the organization owner.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoacheeErrors.NOT_OWNER,
        });
      }
      if (!hostUser.coachee.isAdmin) {
        throw new MindfitException({
          error: 'You cannot edit a Coachee because you are not the admin.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoacheeErrors.NOT_ADMIN,
        });
      }

      if (
        coacheeToEdit?.organization?.id !== hostUser?.coachee?.organization?.id
      ) {
        throw new MindfitException({
          error:
            'You cannot edit this Coachee because he/she does not belong to your organization',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoacheeErrors.COACHEE_FROM_ANOTHER_ORGANIZATION,
        });
      }
      if (!hostUser.coachee.isAdmin && hostUser.id !== owner.id) {
        //caso en que el user logueado no es ni admin ,ni owner de la organization
        return this.update(hostUser.coachee.id, data);
      }
    }

    return this.update(coacheeToEdit.id, data);
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
    const user: User = await this.userService.findOne(userId);

    if (!user.coachee) {
      throw new MindfitException({
        error: `The user does not have a coachee profile`,
        errorCode: 'BAD_REQUEST',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (user.coachee?.assignedCoach?.id) {
      throw new MindfitException({
        error: 'You already has a Coach Assigned.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: SuggestedCoachErrors.COACHEE_ALREADY_HAS_COACH,
      });
    }

    const suggestedCoaches: SuggestedCoaches =
      await this.suggestedCoachesService.findOne(suggestedCoachId);

    const selectedCoach: Coach = suggestedCoaches?.coaches.find(
      (coach) => coach.id == coachId,
    );

    if (!selectedCoach) {
      throw new MindfitException({
        error: 'The Coach is not in suggestion',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: SuggestedCoachErrors.COACH_NOT_SUGGESTED,
      });
    }

    const historicalAssigment: HistoricalAssigment =
      await this.createHistoricalAssigment(user.coachee, selectedCoach, {
        assigmentDate: new Date(),
      });
    if (!historicalAssigment) {
      throw new MindfitException({
        error: 'Historical assigmment could not be created',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode:
          historicalAssigmentErrors.HISTORICAL_ASSIGMENT_CREATION_ERROR,
      });
    }
    return this.update(user.coachee.id, {
      assignedCoach: selectedCoach,
    });
  }

  // hacer un metodo para crear un registro en el modelo HistoricalAssigment con sus respectivas relations
  private async createHistoricalAssigment(
    coachee: Coachee,
    coach: Coach,
    data: CreateHistoricalAssigmentDto,
  ): Promise<HistoricalAssigment> {
    const historicalAssigment: HistoricalAssigment =
      await this.historicalAssigmentService.create({
        ...data,
        coachee,
        coach,
      });

    if (!historicalAssigment) {
      throw new MindfitException({
        error: 'Error creating Historical Assigment',
        errorCode: 'HISTORICAL_ASSIGMENT_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
    return historicalAssigment;
  }

  async getHistoricalCoacheeData(
    coachId: number,
    coacheeId: number,
  ): Promise<HistoricalCoacheeData> {
    const coachees: Coachee[] =
      await this.repository.getHistoricalDataQueryBuilder(coachId);

    const coachee = coachees.find((coachee) => coachee.id === coacheeId);
    return {
      coachee: coachee,
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
    const owner: User = hostUser?.organization?.owner;
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
    if (hostUser.role === Roles.COACHEE && hostUser.coachee.id === coachee.id) {
      throw new MindfitException({
        error:
          type === actionType.SUSPEND
            ? 'You cannot suspend yourself'
            : 'You activate yourself',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: 'You cannot suspend/active yourself',
      });
    }

    if (hostUser.role === Roles.COACHEE && hostUser.id !== owner.id) {
      throw new MindfitException({
        error:
          type === actionType.SUSPEND
            ? 'You cannot suspend a Coachee because you are not an owner'
            : 'You cannot activate a Coachee because you are not an owner',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode:
          type === actionType.SUSPEND
            ? suspendCoacheeByOrganization.NOT_OWNER_ORGANIZATION_SUSPEND_COACHEE
            : activateCoacheeByOrganization.NOT_OWNER_ORGANIZATION_ACTIVATE_COACHEE,
      });
    }

    if (hostUser.role === Roles.COACHEE && !hostUser.coachee.isAdmin) {
      throw new MindfitException({
        error:
          type === actionType.SUSPEND
            ? 'You cannot suspend a Coachee because you are not an admin'
            : 'You cannot activate a Coachee because you are not an admin',
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

  async getCoacheesRecentlyRegistered(
    daysRecentRegistered: number,
  ): Promise<Coachee[]> {
    return this.repository.getCoacheesRecentlyRegistered(daysRecentRegistered);
  }

  async getCoacheesWithoutRecentActivity(
    daysWithoutActivity: number,
  ): Promise<Coachee[]> {
    return this.repository.getCoacheesWithoutRecentActivity(
      daysWithoutActivity,
    );
  }

  async getCoacheesWithUpcomingAppointmentsByCoachId(coachId: number) {
    return this.repository.getCoacheesWithUpcomingAppointmentsByCoachId(
      coachId,
    );
  }

  async getCoacheeDimensionAverages(
    coacheeId: number,
  ): Promise<DimensionAverages[]> {
    const satReport = await this.satReportService.getLastSatReportByCoachee(
      coacheeId,
    );
    return satReport
      ? this.satReportEvaluationService.getDimensionAveragesBySatReports([
          satReport,
        ])
      : [];
  }
}
