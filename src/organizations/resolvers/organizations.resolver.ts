import { UseGuards } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FocusAreas } from 'src/coaching/models/dashboardStatistics/focusAreas.model';
import { DevelopmentAreas } from 'src/coaching/models/dashboardStatistics/developmentAreas.model';
import { CoacheesSatisfaction } from 'src/coaching/models/dashboardStatistics/coacheesSatisfaction.model';
import { CoachingSessionTimeline } from 'src/coaching/models/dashboardStatistics/coachingSessionTimeline.model';
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

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Query(() => Organization, { name: `findOrganizationById` })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Organization> {
    return this.service.findOne(id);
  }

  @UseGuards(RolesGuard(Roles.COACHEE_OWNER, Roles.COACHEE_ADMIN))
  @Query(() => Organization, { name: `getOrganizationProfile` })
  async getOrganizationProfile(
    @CurrentSession() session: UserSession,
  ): Promise<Organization> {
    console.time('start getOrganizationProfile');
    const res = this.service.getOrganizationProfile(session);
    console.timeEnd('start getOrganizationProfile');
    return res;
  }

  @UseGuards(RolesGuard(Roles.COACHEE_OWNER, Roles.COACHEE_ADMIN))
  @Query(() => Organization, { name: `getDinamicOrganizationProfile` })
  async getDinamicOrganizationProfile(
    @CurrentSession() session: UserSession,
    @Info() info,
  ): Promise<Organization> {
    console.time('start getDinamicOrganizationProfile');
    const selections: any[] =
      info.operation.selectionSet.selections[0].selectionSet.selections;
    const fieldsArr: string[] = selections.map((s) => s.name.value);

    const res = this.service.getDinamicOrganizationProfile(session, fieldsArr);
    console.timeEnd('start getDinamicOrganizationProfile');
    return res;
  }

  @UseGuards(RolesGuard(Roles.COACHEE_OWNER))
  @Mutation(() => Organization, { name: `createOrganization` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => OrganizationDto })
    orgData: OrganizationDto,
  ): Promise<Organization> {
    return this.service.createOrganization(session, orgData);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => [Organization], { name: `createManyOrganization` })
  async createMany(
    @Args('data', { type: () => [OrganizationDto] }) orgData: OrganizationDto[],
  ): Promise<Organization[]> {
    return this.service.createManyOrganization(orgData);
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
    return this.service.updateOrganization(session, organizationId, data);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => [Organization], { name: `updateManyOrganizations` })
  async updateMany(
    @Args('organizationIds', { type: () => [Int] }) organizationIds: number[],
    @Args('data', { type: () => EditOrganizationDto })
    editOrganizationDto: EditOrganizationDto,
  ): Promise<Organization[]> {
    return this.service.updateManyOrganizations(
      organizationIds,
      editOrganizationDto,
    );
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Number, { name: `deleteManyOrganizations` })
  async deleteMany(
    @CurrentSession() session: UserSession,
    @Args('organizationIds', { type: () => [Int] }) organizationIds: number[],
  ): Promise<number> {
    return this.service.deleteManyOrganizations(session, organizationIds);
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Number, { name: `deleteOrganization` })
  async delete(
    @CurrentSession() session: UserSession,
    @Args('organizationId', { type: () => Int }) organizationId: number,
  ): Promise<number> {
    return this.service.deleteOrganization(session, organizationId);
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
