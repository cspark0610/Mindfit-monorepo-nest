import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationRepository } from 'src/organizations/repositories/organization.repository';
import { UsersService } from 'src/users/services/users.service';
import {
  isOrganizationAdmin,
  ownOrganization,
  validateIfHostUserIdIsInUsersIdsToDelete,
  validateIfHostUserIdIsUserToDelete,
  validateOwnerCanEditOrganization,
  validateCoacheeAdminCanEditOrganization,
} from 'src/users/validators/users.validators';
import { Roles } from 'src/users/enums/roles.enum';
import { editOrganizationError } from '../enums/editOrganization.enum';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { createOrganizationError } from '../enums/createOrganization.enum';
import { FocusAreas } from 'src/coaching/models/dashboardStatistics/focusAreas.model';
import { DevelopmentAreas } from 'src/coaching/models/dashboardStatistics/developmentAreas.model';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { CoachingSessionFeedbackService } from 'src/videoSessions/services/coachingSessionFeedback.service';
import { CoacheesSatisfaction } from 'src/coaching/models/dashboardStatistics/coacheesSatisfaction.model';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { AwsS3Service } from 'src/aws/services/s3.service';
import {
  EditOrganizationDto,
  OrganizationDto,
} from 'src/organizations/dto/organization.dto';
import { User } from 'src/users/models/users.model';
import { FileMedia } from 'src/aws/models/file.model';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import {
  validateIfCoacheeHasOrganization,
  validateIfDtoIncludesPicture,
} from 'src/coaching/validators/coachee.validators';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    protected readonly repository: OrganizationRepository,
    private usersService: UsersService,
    private satReportService: SatReportsService,
    private satReportEvaluationService: SatReportEvaluationService,
    private coachingSessionFeedbackService: CoachingSessionFeedbackService,
    private coachingSessionService: CoachingSessionService,
    private awsS3Service: AwsS3Service,
    @Inject(forwardRef(() => CoacheeService))
    private coacheeService: CoacheeService,
  ) {
    super();
  }

  async getOrganizationProfile(session: UserSession): Promise<Organization> {
    const coachee: Coachee = await this.coacheeService.getCoacheeByUserEmail(
      session.email.trim(),
    );
    validateIfCoacheeHasOrganization(coachee);
    return this.findOne(coachee.organization.id);
  }

  async getDinamicOrganizationProfile(
    session: UserSession,
    fieldsArr: string[],
  ): Promise<Organization> {
    const coachee: Coachee = await this.coacheeService.getCoacheeByUserEmail(
      session.email.trim(),
    );
    validateIfCoacheeHasOrganization(coachee);
    return this.repository.getDinamicOrganizationProfile(
      session.userId,
      fieldsArr,
    );
  }

  async createOrganization(
    session: UserSession,
    orgData: OrganizationDto,
  ): Promise<Organization> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const data: Organization = await OrganizationDto.from(orgData);
    let profilePicture: FileMedia;

    if (ownOrganization(hostUser)) {
      throw new MindfitException({
        error: 'User already own an organization.',
        errorCode: createOrganizationError.USER_ALREADY_HAS_ORGANIZATION,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    await this.usersService.update(hostUser.id, { role: Roles.COACHEE_OWNER });

    if (orgData.picture) {
      profilePicture = this.awsS3Service.formatS3LocationInfo(
        orgData.picture.key,
      );
    }

    return super.create({ ...data, profilePicture });
  }

  async createManyOrganization(
    orgData: OrganizationDto[],
  ): Promise<Organization[]> {
    orgData.forEach((dto) => {
      validateIfDtoIncludesPicture(dto);
    });
    const data: Partial<Organization>[] = await OrganizationDto.fromArray(
      orgData,
    );
    const usersIds: number[] = data.map((item) => item.owner.id);
    const organizations: Organization[] = await super.createMany(data);
    if (organizations) {
      await this.usersService.updateMany(usersIds, {
        role: Roles.COACHEE_OWNER,
      });
    }
    return organizations;
  }

  async updateOrganization(
    session: UserSession,
    organizationId: number,
    data: EditOrganizationDto,
  ): Promise<Organization> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    if (hostUser.role === Roles.COACHEE_OWNER) {
      validateOwnerCanEditOrganization(organizationId, hostUser);
    }
    if (hostUser.role === Roles.COACHEE_ADMIN) {
      validateCoacheeAdminCanEditOrganization(organizationId, hostUser);
    }

    const organization: Organization = await this.findOne(organizationId);
    return this.updateOrganizationAndFile(hostUser, organization, data);
  }

  async updateOrganizationAndFile(
    hostUser: User,
    organization: Organization,
    data: EditOrganizationDto,
  ): Promise<Organization> {
    let profilePicture: FileMedia = organization.profilePicture;

    // si la data que llega para editar contiene el campo picture
    if (data.picture) {
      if (organization.profilePicture)
        await this.awsS3Service.delete(organization.profilePicture.key);

      profilePicture = this.awsS3Service.formatS3LocationInfo(data.picture.key);
    }
    // si la data que llega para editar no contiene el campo picture
    return this.update(organization.id, { ...data, profilePicture });
  }
  async updateManyOrganizations(
    organizationIds: number[],
    editOrganizationDto: EditOrganizationDto,
  ): Promise<Organization[]> {
    validateIfDtoIncludesPicture(editOrganizationDto);
    return this.repository.updateMany(organizationIds, editOrganizationDto);
  }

  async deleteManyOrganizations(
    session: UserSession,
    organizationIds: number[],
  ): Promise<number> {
    // se comtempla que al eliminar varias orgs se eliminan los users y los perfiles de coachees asociados a los mismos
    const hostUser: User = await this.usersService.findOne(session.userId);
    const promiseUsersArr: Promise<User>[] = organizationIds.map((orgId) =>
      Promise.resolve(this.usersService.getUserByOrganizationId(orgId)),
    );
    const usersIdsToDelete = (await Promise.all(promiseUsersArr)).map(
      (user) => user.id,
    );
    validateIfHostUserIdIsInUsersIdsToDelete(usersIdsToDelete, hostUser);
    return this.usersService.delete(usersIdsToDelete);
  }

  async deleteOrganization(
    session: UserSession,
    organizationId: number,
  ): Promise<number> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const orgToDelete: Organization = await this.findOne(organizationId);
    const userToDelete: User = orgToDelete.owner;

    validateIfHostUserIdIsUserToDelete(userToDelete, hostUser);
    return this.usersService.delete(userToDelete.id);
  }

  async getOrganizationFocusAreas(userId: number): Promise<FocusAreas[]> {
    const user = await this.usersService.findOne(userId);

    if (
      !ownOrganization(user) &&
      !isOrganizationAdmin(user) &&
      !user.coachee?.canViewDashboard
    ) {
      throw new MindfitException({
        error:
          'User is not the organization admin or does not have permissions.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: editOrganizationError.USER_IS_NOT_ORGANIZATION_ADMIN,
      });
    }
    const organization = await this.findOne(user.coachee.organization.id);

    const totalCoachees = organization.coachees.length;

    const coacheesCoachingAreas = organization.coachees.flatMap(
      (coachee) => coachee.coachingAreas,
    );

    const coachingAreasCodenamesSet = [
      ...new Set(
        coacheesCoachingAreas.map((coachingArea) => coachingArea.codename),
      ),
    ];

    return coachingAreasCodenamesSet.map((codename) => ({
      coachingArea: coacheesCoachingAreas.find(
        (coachingArea) => coachingArea.codename === codename,
      ),
      value: coacheesCoachingAreas.filter(
        (coachingArea) => coachingArea.codename === codename,
      ).length,
      base: totalCoachees,
    }));
  }

  async getOrganizationDevelopmentAreas(
    userId: number,
  ): Promise<DevelopmentAreas> {
    const user = await this.usersService.findOne(userId);

    if (
      !ownOrganization(user) &&
      !isOrganizationAdmin(user) &&
      !user.coachee?.canViewDashboard
    ) {
      throw new MindfitException({
        error:
          'User is not the organization admin or does not have permissions.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: editOrganizationError.USER_IS_NOT_ORGANIZATION_ADMIN,
      });
    }
    const organization = await this.findOne(user.coachee.organization.id);
    const satReports = await this.satReportService.getSatReportByCoacheesIds(
      organization.coachees.map((coachee) => coachee.id),
    );

    return this.satReportEvaluationService.getWeakAndStrongDimensionsBySatReports(
      satReports,
    );
  }

  async getOrganizationCoacheesSatisfaction(
    userId: number,
  ): Promise<CoacheesSatisfaction> {
    const user = await this.usersService.findOne(userId);

    if (
      !ownOrganization(user) &&
      !isOrganizationAdmin(user) &&
      !user.coachee?.canViewDashboard
    ) {
      throw new MindfitException({
        error:
          'User is not the organization admin or does not have permissions.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: editOrganizationError.USER_IS_NOT_ORGANIZATION_ADMIN,
      });
    }
    const organization = await this.findOne(user.coachee.organization.id);

    const coacheesFeedbacks =
      await this.coachingSessionFeedbackService.getCoachingSessionFeedbackByCoacheesIds(
        organization.coachees.map((coachee) => coachee.id),
      );

    return this.coachingSessionFeedbackService.getCoacheesCoachingSessionSatisfaction(
      coacheesFeedbacks,
    );
  }

  async getOrganizationCoacheesCoachingSessionTimeline(
    userId: number,
    period: 'DAYS' | 'MONTHS' = 'DAYS',
  ) {
    const user = await this.usersService.findOne(userId);

    if (
      !ownOrganization(user) &&
      !isOrganizationAdmin(user) &&
      !user.coachee?.canViewDashboard
    ) {
      throw new MindfitException({
        error:
          'User is not the organization admin or does not have permissions.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: editOrganizationError.USER_IS_NOT_ORGANIZATION_ADMIN,
      });
    }
    const organization = await this.findOne(user.coachee.organization.id);

    return this.coachingSessionService.getCoacheesCoachingSessionExecutionTimelineDataset(
      organization.coachees.map((coachee) => coachee.id),
      period,
    );
  }
}
