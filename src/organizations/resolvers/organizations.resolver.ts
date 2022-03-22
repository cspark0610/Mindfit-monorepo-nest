import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FocusAreas } from 'src/organizations/models/dashboardStatistics/focusAreas.model';
import { DevelopmentAreas } from 'src/organizations/models/dashboardStatistics/developmentAreas.model';
import { CoacheesSatisfaction } from 'src/organizations/models/dashboardStatistics/coacheesSatisfaction.model';
import { CoachingSessionTimeline } from 'src/organizations/models/dashboardStatistics/coachingSessionTimeline.model';
import {
  EditOrganizationDto,
  OrganizationDto,
} from 'src/organizations/dto/organization.dto';

@Resolver(() => Organization)
@UseGuards(JwtAuthGuard)
export class OrganizationsResolver extends BaseResolver(Organization, {
  create: OrganizationDto,
  update: EditOrganizationDto,
}) {
  constructor(protected readonly service: OrganizationsService) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Organization, { name: `createOrganization` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => OrganizationDto })
    orgData: OrganizationDto,
  ): Promise<Organization> {
    return this.service.createOrganization(session, orgData);
  }

  @UseGuards(
    RolesGuard(
      Roles.COACHEE_OWNER,
      Roles.COACHEE_ADMIN,
      Roles.SUPER_USER,
      Roles.STAFF,
    ),
  )
  @Mutation(() => Organization, { name: `updateOrganization` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('organizationId', { type: () => Int }) organizationId: number,
    @Args('data', { type: () => EditOrganizationDto })
    data: EditOrganizationDto,
  ): Promise<Organization> {
    return this.service.updateOrganization(organizationId, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => [FocusAreas])
  async getOrganizationFocusAreas(@CurrentSession() session: UserSession) {
    return this.service.getOrganizationFocusAreas(session.userId);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => DevelopmentAreas)
  async getOrganizationDevelopmentAreas(
    @CurrentSession() session: UserSession,
  ): Promise<DevelopmentAreas> {
    return this.service.getOrganizationDevelopmentAreas(session.userId);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => CoacheesSatisfaction)
  async getOrganizationCoacheesSatisfaction(
    @CurrentSession() session: UserSession,
  ): Promise<CoacheesSatisfaction> {
    return this.service.getOrganizationCoacheesSatisfaction(session.userId);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => CoachingSessionTimeline)
  async getOrganizationCoacheesCoachingSessionTimeline(
    @CurrentSession() session: UserSession,
    @Args('period', { type: () => String })
    period: 'DAYS' | 'MONTHS' = 'DAYS',
  ): Promise<CoachingSessionTimeline> {
    return this.service.getOrganizationCoacheesCoachingSessionTimeline(
      session.userId,
      period,
    );
  }
}
