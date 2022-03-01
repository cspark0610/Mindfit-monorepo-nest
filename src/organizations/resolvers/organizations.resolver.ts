import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateOrganizationDto,
  EditOrganizationDto,
} from 'src/users/dto/organization.dto';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FocusAreas } from 'src/organizations/models/dashboardStatistics/focusAreas.model';

@Resolver(() => Organization)
@UseGuards(JwtAuthGuard)
export class OrganizationsResolver extends BaseResolver(Organization, {
  create: CreateOrganizationDto,
  update: EditOrganizationDto,
}) {
  constructor(protected readonly service: OrganizationsService) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Organization, { name: `createOrganization` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateOrganizationDto })
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.service.createOrganization(session, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE, Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Organization, { name: `updateOrganization` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('organizationId', { type: () => Int }) organizationId: number,
    @Args('data', { type: () => EditOrganizationDto })
    data: EditOrganizationDto,
  ): Promise<Organization> {
    return this.service.updateOrganization(session, organizationId, data);
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Query(() => [FocusAreas])
  async getOrganizationFocusAreas(@CurrentSession() session: UserSession) {
    return this.service.getOrganizationFocusAreas(session.userId);
  }
}
