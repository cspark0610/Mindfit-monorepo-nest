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
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { suspendCoacheeByOrganization } from 'src/organizations/enums/suspendCoacheeByOrganization.enum';
import { User } from 'src/users/models/users.model';
import { activateCoacheeByOrganization } from '../enums/activateCoacheeByOrganization.enum';

@Resolver(() => Organization)
@UseGuards(JwtAuthGuard)
export class OrganizationsResolver extends BaseResolver(Organization, {
  create: CreateOrganizationDto,
  update: EditOrganizationDto,
}) {
  constructor(
    protected readonly service: OrganizationsService,
    private usersService: UsersService,
    private coacheesService: CoacheeService,
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
    const hostUser = await this.usersService.findOne(session.userId);

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
    const hostUser = await this.usersService.findOne(session.userId);

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

  @UseGuards(RolesGuard(Roles.COACHEE, Roles.SUPER_USER))
  @Mutation(() => Coachee, { name: `suspendCoachee` })
  async suspendCoacheeByOrganization(
    @CurrentSession() session: UserSession,
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
  ): Promise<Coachee> {
    const hostUser: User = await this.usersService.findOne(session.userId);
    const coachee: Coachee = await this.coacheesService.findOne(coacheeId);

    if (!coachee.id) {
      throw new MindfitException({
        error: 'Coachee not found to suspend',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: suspendCoacheeByOrganization.NOT_FOUND_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      !hostUser.coachee.organization.id &&
      !hostUser.coachee.isAdmin
    ) {
      throw new MindfitException({
        error:
          'You cannot suspend a Coachee because you do not own or admin an organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode:
          suspendCoacheeByOrganization.NOT_OWNER_ORGANIZATION_SUSPEND_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      coachee.organization.id !== hostUser.coachee.organization.id
    ) {
      throw new MindfitException({
        error:
          'You cannot suspend this Coachee because he/she does not belong to your organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode:
          suspendCoacheeByOrganization.COACHEE_FROM_ANOTHER_ORGANIZATION,
      });
    }
    const suspendUpdateData = { isSuspended: true, isActive: false };
    return this.coacheesService.updateCoachee(coacheeId, suspendUpdateData);
  }

  @UseGuards(RolesGuard(Roles.COACHEE, Roles.SUPER_USER))
  @Mutation(() => Coachee, { name: `activateCoachee` })
  async activateCoacheeByOrganization(
    @CurrentSession() session: UserSession,
    @Args('coacheeId', { type: () => Int }) coacheeId: number,
  ): Promise<Coachee> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const coachee: Coachee = await this.coacheesService.findOne(coacheeId);

    if (!coachee.id) {
      throw new MindfitException({
        error: 'Coachee not found to activate',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: activateCoacheeByOrganization.NOT_FOUND_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      !hostUser.coachee.organization.id &&
      !hostUser.coachee.isAdmin
    ) {
      throw new MindfitException({
        error:
          'You cannot activate this Coachee because you do not own or admin an organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode:
          activateCoacheeByOrganization.NOT_OWNER_ORGANIZATION_ACTIVATE_COACHEE,
      });
    }
    if (
      hostUser.role === Roles.COACHEE &&
      coachee.organization.id !== hostUser.coachee.organization.id
    ) {
      throw new MindfitException({
        error:
          'You cannot activate this Coachee because he/she does not belong to your organization',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode:
          activateCoacheeByOrganization.COACHEE_FROM_ANOTHER_ORGANIZATION,
      });
    }
    const activateUpdateData = { isSuspended: false, isActive: true };
    if (coachee.isSuspended) {
      // only activates coachee if coachee is suspended true
      return this.coacheesService.updateCoachee(coacheeId, activateUpdateData);
    }
    throw new MindfitException({
      error: 'Coachee is already active',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: activateCoacheeByOrganization.COACHEE_ALREADY_ACTIVE,
    });
  }
}
