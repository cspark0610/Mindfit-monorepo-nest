import { Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { BaseService } from 'src/common/service/base.service';
import {
  isOrganizationAdmin,
  isOrganizationOwner,
  ownOrganization,
} from 'src/users/validators/users.validators';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Emails } from 'src/strapi/enum/emails.enum';
import { AwsSesService } from 'src/aws/services/ses.service';
import { UsersService } from 'src/users/services/users.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import {
  InviteCoacheeDto,
  CoacheeDto,
  CreateCoacheeOwner,
  CreateOrganizationCoachee,
} from 'src/coaching/dto/coachee.dto';
import { Organization } from 'src/organizations/models/organization.model';
import { Roles } from 'src/users/enums/roles.enum';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { CoacheeRegistrationStatus } from 'src/coaching/enums/coacheeRegistrationStatus.enum';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { HistoricalCoacheeData } from 'src/coaching/models/historicalCoacheeData.model';
import { actionType } from 'src/coaching/enums/actionType.enum';
import { User } from 'src/users/models/users.model';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { EditCoacheeDto } from 'src/coaching/dto/coachee.dto';
import { CreateHistoricalAssigmentDto } from '../dto/historicalAssigment.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { historicalAssigmentErrors } from 'src/coaching/enums/historicalAssigmentError.enum';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { DimensionAverages } from 'src/evaluationTests/models/dimensionAverages.model';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { FileMedia } from 'src/aws/models/file.model';

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
    private awsS3Service: AwsS3Service,
    private organizationService: OrganizationsService,
  ) {
    super();
  }

  /**
   * Validate that the given user has a Coachee Profile
   * Return the coachee profile if validation pass
   */
  async validateCoacheeProfile(userId: number): Promise<Coachee> {
    const user: User = await this.userService.findOne(userId);

    if (!user.coachee) {
      throw new MindfitException({
        error: `The user does not have a coachee profile`,
        errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    return user.coachee;
  }

  /**
   * Validate that the given user has an active Coachee Profile
   * Return the coachee profile if validation pass
   */
  async validateActiveCoacheeProfile(userId: number): Promise<Coachee> {
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

  /**
   * For testing purposes, allow to create directly an Coachee owner with user and organization
   */
  async createCoacheeOwner(data: CreateCoacheeOwner) {
    const user = await this.userService.create(data.userData);

    const organization = await this.organizationService.create({
      owner: user,
      ...data.organizationData,
    });

    return this.create({
      user,
      organization,
      isAdmin: true,
      position: data.position,
    });
  }

  /**
   * For testing purposes, allow to create directly a Coachee related to an organization
   */
  async createOrganizationCoachee(data: CreateOrganizationCoachee) {
    const organization = await this.organizationService.findOne(
      data.organizationId,
    );
    const user = await this.userService.create(data.userData);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { organizationId, userData, ...rest } = data;

    return this.create({
      user,
      organization,
      invited: true,
      invitationAccepted: true,
      ...rest,
    });
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

    const appointment = await this.coachAppointmentService.findAll({
      coachee,
    });

    if (appointment.length > 0) {
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
  async createCoachee(coacheeData: CoacheeDto): Promise<Coachee> {
    const data: Partial<Coachee> = await CoacheeDto.from(coacheeData);
    if (coacheeData?.picture?.data?.length) {
      const {
        picture: { filename, data: buffer },
      } = coacheeData;

      const profilePicture: FileMedia = await this.awsS3Service.uploadMedia(
        filename,
        buffer,
      );
      return this.createCoacheeMethod({ ...data, profilePicture });
    }
    //not image
    return this.createCoacheeMethod(data);
  }
  async createCoacheeMethod(data: Partial<Coachee>): Promise<Coachee> {
    const coachee = await this.repository.create(data);
    return coachee;
  }

  async updateCoachee(
    session: UserSession,
    coacheeId: number,
    data: EditCoacheeDto,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(session.userId);
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
      //caso en que el cochee owner edita al coacheeToEdit
      if (!isOrganizationOwner(hostUser)) {
        throw new MindfitException({
          error:
            'You cannot edit a Coachee because you are not the organization owner.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.NOT_OWNER,
        });
      }
      if (!hostUser.coachee.isAdmin) {
        throw new MindfitException({
          error: 'You cannot edit a Coachee because you are not the admin.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.NOT_ADMIN,
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
      return this.updateCoacheeAndFile(coacheeToEdit, data);
    }
    if (
      hostUser.role === Roles.COACHEE &&
      coacheeToEdit.id == hostUser.coachee.id
    ) {
      //caso en que el coachee OWNER logueado quiera editar su propio perfil
      return this.updateCoacheeAndFile(hostUser.coachee, data);
    }
    // caso en que es super_user logueado
    return this.updateCoacheeAndFile(coacheeToEdit, data);
  }

  async updateCoacheeAndFile(
    coachee: Coachee,
    data: EditCoacheeDto,
  ): Promise<Coachee> {
    // si la data que llega para editar contiene el campo picture
    if (data.picture && coachee.profilePicture) {
      const { key } = coachee.profilePicture;
      const {
        picture: { filename, data: buffer },
      } = data;
      const profilePicture: FileMedia =
        await this.awsS3Service.deleteAndUploadMedia(filename, buffer, key);
      return this.update(coachee.id, { ...data, profilePicture });
    }
    // si la data que llega para editar no contiene el campo picture
    return this.update(coachee.id, { ...data });
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
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode: CoachingError.UNAUTHORIZED,
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
      const coachee: Coachee = await this.create({
        user,
        organization,
        ...coacheeData,
      });
      // si existe un picture le subimos la imagen a s3 y actualizo su profilepicture
      if (coachee && coacheeData.picture.data.length) {
        const {
          picture: { filename, data: buffer },
        } = coacheeData;
        const profilePicture: FileMedia = await this.awsS3Service.uploadMedia(
          filename,
          buffer,
        );
        await this.update(coachee.id, { profilePicture });
      }

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
        errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (user.role != Roles.COACHEE) {
      throw new MindfitException({
        error: `The coachee profile does not have a COACHEE role.`,
        errorCode: CoacheeErrors.NO_COACHEE_ROLE,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (!user.coachee?.invited) {
      throw new MindfitException({
        error: `Coachee id ${user.coachee.id} has no invitation.`,
        errorCode: CoacheeErrors.COACHEE_NOT_INVITED,
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
        errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (user.coachee?.assignedCoach?.id) {
      throw new MindfitException({
        error: 'You already has a Coach Assigned.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.COACHEE_ALREADY_HAS_COACH,
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
        errorCode: CoachErrors.COACH_NOT_SUGGESTED,
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
        errorCode:
          historicalAssigmentErrors.HISTORICAL_ASSIGMENT_CREATION_ERROR,
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
    return this.repository.getCoacheeByUserEmail(email.trim());
  }

  async suspendOrActivateCoachee(
    userId: number,
    coacheeId: number,
    type: string,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(userId);

    // buscar la organization del hostUser, que es el coacheeOwner por organizationId
    const organizationOwnerId: number = hostUser?.organization?.id;
    const organization: Organization = await this.organizationService.findOne(
      organizationOwnerId,
    );

    const coachee: Coachee = await this.findOne(coacheeId);
    let coacheesIdsInOrg: number[] = [];
    coacheesIdsInOrg = organization?.coachees
      ? organization?.coachees?.map((coachee) => coachee.id)
      : [];

    if (!coachee) {
      throw new MindfitException({
        error:
          type === actionType.SUSPEND
            ? 'Coachee not found to suspend'
            : 'Coachee not found to activate',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode:
          type === actionType.SUSPEND
            ? CoacheeErrors.NOT_FOUND_COACHEE_TO_SUSPEND
            : CoacheeErrors.NOT_FOUND_COACHEE_TO_ACTIVATE,
      });
    }

    if (hostUser.role === Roles.COACHEE) {
      if (hostUser?.coachee?.id === coachee?.id) {
        throw new MindfitException({
          error:
            type === actionType.SUSPEND
              ? 'You cannot suspend yourself'
              : 'You activate yourself',
          statusCode: HttpStatus.FORBIDDEN,
          errorCode: CoachingError.NOT_ALLOWED_ACTION,
        });
      }

      if (hostUser?.id !== organization.owner?.id) {
        throw new MindfitException({
          error:
            type === actionType.SUSPEND
              ? 'You cannot suspend a Coachee because you are not an owner'
              : 'You cannot activate a Coachee because you are not an owner',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode:
            type === actionType.SUSPEND
              ? CoacheeErrors.NOT_OWNER_ORGANIZATION_SUSPEND_COACHEE
              : CoacheeErrors.NOT_OWNER_ORGANIZATION_ACTIVATE_COACHEE,
        });
      }

      if (
        hostUser?.id !== organization.owner?.id &&
        !hostUser?.coachee?.isAdmin
        // si el coachee  NO es el owner de la organization, y no es admin, no puede suspender
      ) {
        throw new MindfitException({
          error:
            type === actionType.SUSPEND
              ? 'You cannot suspend a Coachee because you are not an admin'
              : 'You cannot activate a Coachee because you are not an admin',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode:
            type === actionType.SUSPEND
              ? CoacheeErrors.NOT_OWNER_ORGANIZATION_SUSPEND_COACHEE
              : CoacheeErrors.NOT_OWNER_ORGANIZATION_ACTIVATE_COACHEE,
        });
      }

      if (!coacheesIdsInOrg.includes(coachee.id)) {
        throw new MindfitException({
          error:
            type === actionType.SUSPEND
              ? 'You cannot suspend this Coachee because he/she does not belong to your organization'
              : 'You cannot activate this Coachee because he/she does not belong to your organization',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode:
            type === actionType.SUSPEND
              ? CoacheeErrors.COACHEE_FROM_ANOTHER_ORGANIZATION
              : CoacheeErrors.COACHEE_FROM_ANOTHER_ORGANIZATION,
        });
      }
    }

    if (type === actionType.SUSPEND && coachee.isSuspended) {
      throw new MindfitException({
        error: 'Coachee is already suspended',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.COACHEE_ALREADY_SUSPENDED,
      });
    }
    if (type === actionType.ACTIVATE && coachee.isActive) {
      throw new MindfitException({
        error: 'Coachee is already active',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.COACHEE_ALREADY_ACTIVE,
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
    coachId: number,
  ): Promise<Coachee[]> {
    const coachees = await this.repository.getCoacheesRecentlyRegistered(
      daysRecentRegistered,
      coachId,
    );
    return coachees;
  }

  async getCoacheesWithoutRecentActivity(
    daysWithoutActivity: number,
    coachId: number,
  ): Promise<Coachee[]> {
    const coachees = await this.repository.getCoacheesWithoutRecentActivity(
      daysWithoutActivity,
      coachId,
    );
    return coachees;
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
