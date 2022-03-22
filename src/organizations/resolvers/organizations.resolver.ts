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
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
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
  constructor(
    protected readonly service: OrganizationsService,
    private coacheeService: CoacheeService,
  ) {
    super();
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Query(() => Organization, { name: `findOrganizationById` })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Organization> {
    return this.service.findOne(id);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => Organization, { name: `getOrganizationProfile` })
  async getOrganizationProfile(
    @CurrentSession() session: UserSession,
  ): Promise<Organization> {
    // el coachee owner en este caso trae la info acerca de su organization
    const coachee: Coachee = await this.coacheeService.getCoacheeByUserEmail(
      session.email,
    );
    if (!coachee.organization) {
      throw new MindfitException({
        error: 'No organization found',
        errorCode: 'ORGANIZATION_NOT_FOUND',
        statusCode: 404,
      });
    }
    return coachee.organization;
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

  @UseGuards(
    RolesGuard(Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER),
  )
  @Query(() => [FocusAreas])
  async getOrganizationFocusAreas(@CurrentSession() session: UserSession) {
    return this.service.getOrganizationFocusAreas(session.userId);
  }

  @UseGuards(
    RolesGuard(Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER),
  )
  @Query(() => DevelopmentAreas)
  async getOrganizationDevelopmentAreas(
    @CurrentSession() session: UserSession,
  ): Promise<DevelopmentAreas> {
    return this.service.getOrganizationDevelopmentAreas(session.userId);
  }

  @UseGuards(
    RolesGuard(Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER),
  )
  @Query(() => CoacheesSatisfaction)
  async getOrganizationCoacheesSatisfaction(
    @CurrentSession() session: UserSession,
  ): Promise<CoacheesSatisfaction> {
    return this.service.getOrganizationCoacheesSatisfaction(session.userId);
  }

  @UseGuards(
    RolesGuard(Roles.COACHEE, Roles.COACHEE_ADMIN, Roles.COACHEE_OWNER),
  )
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
