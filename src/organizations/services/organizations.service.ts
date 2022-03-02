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
import { FocusAreas } from 'src/organizations/models/dashboardStatistics/focusAreas.model';
import { DevelopmentAreas } from 'src/organizations/models/dashboardStatistics/developmentAreas.model';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    protected readonly repository: OrganizationRepository,
    private usersService: UsersService,
    private satReportService: SatReportsService,
    private satReportEvaluationService: SatReportEvaluationService,
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

    return this.repository.create({ owner: hostUser, ...data });
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
}
