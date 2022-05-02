import { Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { BaseService } from 'src/common/service/base.service';
import {
  isOrganizationAdmin,
  ownOrganization,
  validateIfHostUserIdIsInUsersIdsToDelete,
  validateIfHostUserIdIsUserToDelete,
  validateIfUserCoacheeIsInvited,
  validateIfUserHasAssignedCoach,
  validateIfUserHasCoacheeProfile,
  validateIfUserHasCoacheeRole,
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
import {
  validateIfCoacheesIdsIncludesHostUserId,
  validateIfDtoIncludesPicture,
  validateIfHostUserIsSuspendingOrActivatingHimself,
  validateIfCoacheeToSuspenIsInCoacheeOrganization,
  isCoacheeAlreadyActivated,
  isCoacheeAlreadySuspended,
} from 'src/coaching/validators/coachee.validators';
import { CoacheesRegistrationStatus } from 'src/coaching/models/dashboardStatistics/coacheesRegistrationStatus.model';

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
    return await this.findOne(user.coachee.id);
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

  async validateCoacheeHaveSelectedCoach(coachee: Coachee) {
    if (!coachee?.assignedCoach) {
      throw new MindfitException({
        error: `The coachee has no coach selected.`,
        errorCode: CoacheeErrors.NO_COACH_ASSIGNED,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  /**
   * For testing purposes, allow to create directly an Coachee owner with user and organization
   */
  async createCoacheeOwner(data: CreateCoacheeOwner) {
    const user = await this.userService.create({
      email: data.userData.email,
      name: data.userData.name,
      password: data.userData.password,
      role: Roles.COACHEE_OWNER,
    });

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

  async createManyCoachee(coacheeData: CoacheeDto[]): Promise<Coachee[]> {
    const data: Partial<Coachee>[] = await CoacheeDto.fromArray(coacheeData);
    // NO SE PERMITE QUE SUBAN IMAGENES EN EL CREATE MANY
    coacheeData.forEach((dto) => {
      validateIfDtoIncludesPicture(dto);
    });

    return this.repository.createMany(data);
  }

  /**
   * For testing purposes, allow to create directly a Coachee related to an organization
   */
  async createOrganizationCoachee(data: CreateOrganizationCoachee) {
    const organization = await this.organizationService.findOne(
      data.organizationId,
    );

    const user = await this.userService.create({
      email: data.userData.email,
      name: data.userData.name,
      password: data.userData.password,
      role: data.isAdmin ? Roles.COACHEE_ADMIN : Roles.COACHEE,
    });

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

  async getCoacheeRegistrationStatus(id?: number, coachee?: Coachee) {
    if (!id && !coachee) {
      throw new MindfitException({
        error: `ID or Coachee are required`,
        errorCode: '400',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    !coachee ? (coachee = await this.findOne(id)) : coachee;

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
    // Update User Role
    await this.userService.update(coacheeData.userId, {
      role: coacheeData.isAdmin ? Roles.COACHEE_ADMIN : Roles.COACHEE,
    });
    let profilePicture: FileMedia;

    if (coacheeData.picture) {
      profilePicture = this.awsS3Service.formatS3LocationInfo(
        coacheeData.picture.key,
      );
    }

    return super.create({ ...data, profilePicture });
  }

  async updateCoachee(
    session: UserSession,
    coacheeId: number,
    data: EditCoacheeDto,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const coacheeToEdit: Coachee = await this.findOne(coacheeId);

    if ([Roles.STAFF, Roles.SUPER_USER].includes(hostUser.role)) {
      return this.updateCoacheeAndFile(coacheeToEdit, data);
    }
    // If is a coachee regular, and its not their coachee profile, cannot edit
    if (
      hostUser.role === Roles.COACHEE &&
      coacheeToEdit.id != hostUser.coachee.id
    ) {
      throw new MindfitException({
        error: 'You do not have permission to edit other coachees.',
        statusCode: HttpStatus.FORBIDDEN,
        errorCode: CoacheeErrors.COACHEE_NOT_ADMIN,
      });
    }
    // If user is owner/admin, but coachee from another organization
    if (
      [Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER].includes(hostUser.role) &&
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

  async updateManyCoachee(
    session: UserSession,
    coacheeIds: number[],
    editCoacheeDto: EditCoacheeDto,
  ): Promise<Coachee[]> {
    // EL SERVICIO NO COMTEMPLA PODER EDITAR LAS IMAGENES DE LOS COACHEE NI EDITARLOS DESDE S3
    const hostUser: User = await this.userService.findOne(session.userId);

    validateIfCoacheesIdsIncludesHostUserId(coacheeIds, hostUser);
    validateIfDtoIncludesPicture(editCoacheeDto);

    return this.repository.updateMany(coacheeIds, editCoacheeDto);
  }

  async updateCoacheeRoleToCoacheeAdmin(
    data: EditCoacheeDto,
    coachee: Coachee,
  ): Promise<void> {
    // si campo isAdmin llega como "true" de EditCoacheeDto se debe actualizar tb el role del user a coachee_admin
    const user: User = coachee.user;
    data?.isAdmin
      ? await this.userService.update(user.id, {
          role: Roles.COACHEE_ADMIN,
        })
      : await this.userService.update(user.id, {
          role: Roles.COACHEE,
        });
  }

  async updateCoacheeAndFile(
    coachee: Coachee,
    data: EditCoacheeDto,
  ): Promise<Coachee> {
    let profilePicture: FileMedia = coachee.profilePicture;

    if (coachee.user.role !== Roles.COACHEE_OWNER) {
      this.updateCoacheeRoleToCoacheeAdmin(data, coachee);
    }
    // si la data que llega para editar contiene el campo picture
    if (data.picture) {
      if (coachee.profilePicture)
        await this.awsS3Service.delete(coachee.profilePicture.key);

      profilePicture = this.awsS3Service.formatS3LocationInfo(data.picture.key);
    }
    // si la data que llega para editar no contiene el campo picture
    return this.update(coachee.id, { ...data, profilePicture });
  }

  async deleteManyCoachees(
    session: UserSession,
    coacheeIds: number[],
  ): Promise<number> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const promiseCoacheeArray: Promise<Coachee>[] = coacheeIds.map(
      (coacheeId) => Promise.resolve(this.findOne(coacheeId)),
    );
    const coachees: Coachee[] = await Promise.all(promiseCoacheeArray);
    const usersIdsToDelete: number[] = coachees.map(
      (coachee) => coachee.user.id,
    );
    validateIfHostUserIdIsInUsersIdsToDelete(usersIdsToDelete, hostUser);
    return this.userService.delete(usersIdsToDelete);
  }

  async deleteCoachee(
    session: UserSession,
    coacheeId: number,
  ): Promise<number> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const coacheeToDelete: Coachee = await this.findOne(coacheeId);
    const userToDelete: User = coacheeToDelete.user;

    validateIfHostUserIdIsUserToDelete(userToDelete, hostUser);
    return this.userService.delete(userToDelete.id);
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

    //Create user
    const { user } = await this.userService.createInvitedUser(
      userData,
      coacheeData.isAdmin ? Roles.COACHEE_ADMIN : Roles.COACHEE,
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
            language: user.language,
            to: [user.email],
            subject: `${hostUser.name} te ha invitado a Mindfit`,
          },
          { code: hashResetPassword },
        ),
      ]);

      return coachee;
    } catch (error) {
      console.error('\nCoacheesResolver - ERROR INVITING USER:\n', error);
      await this.userService.delete(user.id);
    }
  }

  async acceptInvitation(userId: number): Promise<Coachee> {
    const user = await this.userService.findOne(userId);
    validateIfUserHasCoacheeProfile(user);
    validateIfUserHasCoacheeRole(user);
    validateIfUserCoacheeIsInvited(user);
    await this.update(user.coachee.id, { invitationAccepted: true });
    return this.findOne(user.coachee.id);
  }

  async selectCoach(
    userId: number,
    coachId: number,
    suggestedCoachId: number,
  ): Promise<Coachee> {
    const user: User = await this.userService.findOne(userId);
    validateIfUserHasCoacheeProfile(user);
    validateIfUserHasAssignedCoach(user);

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
  async createHistoricalAssigment(
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

  async getDinamicCoacheeByUserEmail(
    email: string,
    fieldsArr: string[],
  ): Promise<Coachee> {
    return this.repository.getDinamicCoacheeByUserEmail(
      email.trim(),
      fieldsArr,
    );
  }

  async suspendOrActivateCoachee(
    userId: number,
    coacheeId: number,
    type: string,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(userId);
    const coachee: Coachee = await this.findOne(coacheeId);

    if (
      [Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER].includes(
        hostUser.role,
      )
    ) {
      validateIfHostUserIsSuspendingOrActivatingHimself(
        hostUser.coachee.id,
        coachee.id,
        type,
      );
      //valido si el coachee a suspender esta en la organizacion
      validateIfCoacheeToSuspenIsInCoacheeOrganization(hostUser, coachee, type);
    }
    //valido si el coachee a suspender ya esta suspendido
    isCoacheeAlreadySuspended(coachee, type);
    //valido si el coachee a suspender ya esta activado
    isCoacheeAlreadyActivated(coachee, type);
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

  async getCoacheesRegistrationStatus(): Promise<CoacheesRegistrationStatus> {
    const allCoachees = await this.findAll();

    const coacheesStatus = await Promise.all(
      allCoachees.map((coachee) =>
        this.getCoacheeRegistrationStatus(null, coachee),
      ),
    );

    const totalCoachees = allCoachees.length;

    return {
      totalCoachees,

      percentageByStatus: Object.keys(CoacheeRegistrationStatus).map(
        (statusEnum) => {
          const result = {
            status: CoacheeRegistrationStatus[statusEnum],

            total: coacheesStatus.filter(
              (coacheeStatus) =>
                coacheeStatus === CoacheeRegistrationStatus[statusEnum],
            ).length,

            percentage:
              ((coacheesStatus.filter(
                (coacheeStatus) =>
                  coacheeStatus === CoacheeRegistrationStatus[statusEnum],
              ).length /
                totalCoachees) *
                100) |
              0,
          };

          return result;
        },
      ),
    };
  }
}
