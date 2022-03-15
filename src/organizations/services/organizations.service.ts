import { HttpStatus, Injectable } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationRepository } from 'src/organizations/repositories/organization.repository';
import { UsersService } from 'src/users/services/users.service';
import {
  isOrganizationAdmin,
  isOrganizationOwner,
  ownOrganization,
} from 'src/users/validators/users.validators';
import { EditOrganizationDto } from 'src/users/dto/organization.dto';
import { Roles } from 'src/users/enums/roles.enum';
import { editOrganizationError } from '../enums/editOrganization.enum';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { createOrganizationError } from '../enums/createOrganization.enum';
import { FocusAreas } from 'src/organizations/models/dashboardStatistics/focusAreas.model';
import { DevelopmentAreas } from 'src/organizations/models/dashboardStatistics/developmentAreas.model';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { CoachingSessionFeedbackService } from 'src/videoSessions/services/coachingSessionFeedback.service';
import { CoacheesSatisfaction } from 'src/organizations/models/dashboardStatistics/coacheesSatisfaction.model';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { OrganizationDto } from 'src/organizations/dto/organization.dto';
import { User } from 'src/users/models/users.model';
import { FileMedia } from 'src/aws/models/file.model';

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
  ) {
    super();
  }

  async createOrganization(
    session: UserSession,
    orgData: OrganizationDto,
  ): Promise<Organization> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const data: Organization = await OrganizationDto.from(orgData);
    if (ownOrganization(hostUser)) {
      throw new MindfitException({
        error: 'User already own an organization.',
        errorCode: createOrganizationError.USER_ALREADY_HAS_ORGANIZATION,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    if (orgData?.picture?.data?.length) {
      const {
        picture: { filename, data: buffer },
      } = orgData;
      const profilePicture: FileMedia = await this.awsS3Service.uploadImage(
        filename,
        buffer,
      );
      return this.createOrganizationMethod({ ...data, profilePicture });
    }
    // not image file
    return this.createOrganizationMethod(data);
  }

  async createOrganizationMethod(data: Organization): Promise<Organization> {
    const organization = await this.repository.create(data);
    return organization;
  }

  async updateOrganization(
    session: UserSession,
    organizationId: number,
    data: EditOrganizationDto,
  ): Promise<Organization> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const organization: Organization = await this.findOne(organizationId);

    if (hostUser.role === Roles.COACHEE) {
      if (!ownOrganization(hostUser)) {
        throw new MindfitException({
          error: 'User does not have an organization.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: editOrganizationError.USER_DOES_NOT_HAVE_ORGANIZATION,
        });
      }
      if (!isOrganizationAdmin(hostUser)) {
        throw new MindfitException({
          error: 'User is not the organization admin.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: editOrganizationError.USER_IS_NOT_ORGANIZATION_ADMIN,
        });
      }
      if (!isOrganizationOwner(hostUser)) {
        throw new MindfitException({
          error: 'User is not the organization owner.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: editOrganizationError.USER_IS_NOT_ORGANIZATION_OWNER,
        });
      }
      // para el caso Coachee owner de la organizacion
      return this.updateOrganizationAndFile(organization, data);
    }
    // para el caso super_user y staff
    return this.updateOrganizationAndFile(organization, data);
  }

  async updateOrganizationAndFile(
    organization: Organization,
    data: EditOrganizationDto,
  ): Promise<Organization> {
    // si la data que llega para editar contiene el campo picture
    if (data.picture && organization.profilePicture) {
      const { key } = organization.profilePicture;
      const {
        picture: { filename, data: buffer },
      } = data;
      const profilePicture: FileMedia =
        await this.awsS3Service.deleteAndUploadMedia(filename, buffer, key);
      return this.update(organization.id, { ...data, profilePicture });
    }
    // si la data que llega para editar no contiene el campo picture
    return this.update(organization.id, { ...data });
  }
  async getOrganizationFocusAreas(userId: number): Promise<FocusAreas[]> {
    const user = await this.usersService.findOne(userId);

    if (
      !ownOrganization(user) &&
      !isOrganizationAdmin(user) &&
      !user.coachee.canViewDashboard
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
      !user.coachee.canViewDashboard
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
      !user.coachee.canViewDashboard
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
      !user.coachee.canViewDashboard
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
