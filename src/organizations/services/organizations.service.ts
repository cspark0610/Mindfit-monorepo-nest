import { HttpStatus, Injectable } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationRepository } from 'src/organizations/repositories/organization.repository';
import { UsersService } from 'src/users/services/users.service';
import {
  isOrganizationAdmin,
  ownOrganization,
} from 'src/users/validators/users.validators';
import { CreateOrganizationDto } from '../dto/organization.dto';
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

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    protected readonly repository: OrganizationRepository,
    private usersService: UsersService,
    private satReportService: SatReportsService,
    private satReportEvaluationService: SatReportEvaluationService,
    private coachingSessionFeedbackService: CoachingSessionFeedbackService,
    private coachingSessionService: CoachingSessionService,
  ) {
    super();
  }

  async createOrganization(
    session: UserSession,
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    const hostUser = await this.usersService.findOne(session.userId);

    if (ownOrganization(hostUser)) {
      throw new MindfitException({
        error: 'User already own an organization.',
        errorCode: `USER_ALREADY_HAS_ORGANIZATION`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    const organization = await this.repository.create({
      owner: hostUser,
      ...data,
    });
    if (!organization) {
      throw new MindfitException({
        error: 'Organization could not be created.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: createOrganizationError.ORGANIZATION_CREATE_ERROR,
      });
    }
    await this.repository.relationOrganizationWithCoachee(
      organization,
      hostUser.coachee,
    );
    return organization;
  }

  async updateOrganization(
    session: UserSession,
    organizationId: number,
    data: EditOrganizationDto,
  ): Promise<Organization> {
    const hostUser = await this.usersService.findOne(session.userId);

    if (!ownOrganization(hostUser) && hostUser.role === Roles.COACHEE) {
      throw new MindfitException({
        error: 'User does not have an organization.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: editOrganizationError.USER_DOES_NOT_HAVE_ORGANIZATION,
      });
    }
    if (!isOrganizationAdmin(hostUser) && hostUser.role === Roles.COACHEE) {
      throw new MindfitException({
        error: 'User is not the organization admin.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: editOrganizationError.USER_DOES_IS_NOT_ORGANIZATION_ADMIN,
      });
    }

    return this.repository.update(organizationId, data);
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
        errorCode: editOrganizationError.USER_DOES_IS_NOT_ORGANIZATION_ADMIN,
      });
    }
    const organization = await this.findOne(user.coachee.organization.id);

    const totalCoachees = organization.coachees.length;

    const coacheesCoachingAreas = organization.coachees.flatMap(
      (coachee) => coachee.coachingAreas,
    );

    const coachingAreasSet = new Set(coacheesCoachingAreas);

    return Array.from(coachingAreasSet).map((area) => {
      return {
        coachingArea: area,
        value: coacheesCoachingAreas.filter(
          (coachingArea) => coachingArea.codename === area.codename,
        ).length,
        base: totalCoachees,
      };
    });
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
        errorCode: editOrganizationError.USER_DOES_IS_NOT_ORGANIZATION_ADMIN,
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
        errorCode: editOrganizationError.USER_DOES_IS_NOT_ORGANIZATION_ADMIN,
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
        errorCode: editOrganizationError.USER_DOES_IS_NOT_ORGANIZATION_ADMIN,
      });
    }
    const organization = await this.findOne(user.coachee.organization.id);

    return this.coachingSessionService.getCoacheesCoachingSessionExecutionTimelineDataset(
      organization.coachees.map((coachee) => coachee.id),
      period,
    );
  }
}
