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

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    protected readonly repository: OrganizationRepository,
    private usersService: UsersService,
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
}
