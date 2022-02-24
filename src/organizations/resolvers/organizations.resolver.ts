import { HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateOrganizationDto,
  EditOrganizationDto,
} from 'src/users/dto/organization.dto';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { UsersService } from 'src/users/services/users.service';
import {
  isOrganizationAdmin,
  ownOrganization,
} from 'src/users/validators/users.validators';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { editOrganizationError } from '../enums/editOrganization.enum';

@Resolver(() => Organization)
@UseGuards(JwtAuthGuard)
export class OrganizationsResolver extends BaseResolver(Organization, {
  create: CreateOrganizationDto,
  update: EditOrganizationDto,
}) {
  constructor(
    protected readonly service: OrganizationsService,
    private userService: UsersService,
  ) {
    super();
  }

  @UseGuards(RolesGuard(Roles.COACHEE))
  @Mutation(() => Organization, { name: `createOrganization` })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateOrganizationDto })
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    const hostUser = await this.userService.findOne(session.userId);

    if (ownOrganization(hostUser)) {
      throw new MindfitException({
        error: 'User already own an organization.',
        errorCode: `USER_ALREADY_HAS_ORGANIZATION`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return this.service.create({ owner: hostUser, ...data });
  }

  @UseGuards(RolesGuard(Roles.COACHEE, Roles.SUPER_USER, Roles.STAFF))
  @Mutation(() => Organization, { name: `updateOrganization` })
  async update(
    @CurrentSession() session: UserSession,
    @Args('organizationId', { type: () => Int }) organizationId: number,
    @Args('data', { type: () => EditOrganizationDto })
    data: EditOrganizationDto,
  ): Promise<Organization> {
    const hostUser = await this.userService.findOne(session.userId);

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
        errorCode: editOrganizationError.USER_DOES_IS_NOT_ORGANIZATION_ADMIN,
      });
    }
    return this.service.update(organizationId, data);
  }
}
