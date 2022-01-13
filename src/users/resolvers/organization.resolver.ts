import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  EditOrganizationDto,
  CreateOrganizationDto,
} from '../dto/organization.dto';
import { Organization } from '../models/organization.model';
import { User } from '../models/users.model';
import { OrganizationService } from '../services/organization.service';
import { UsersService } from '../services/users.service';
import { ownOrganization } from '../validators/users.validators';

@Resolver(() => Organization)
@UseGuards(JwtAuthGuard)
export class OrganizationsResolver extends BaseResolver(Organization, {
  create: CreateOrganizationDto,
  update: EditOrganizationDto,
}) {
  constructor(
    protected readonly service: OrganizationService,
    private userService: UsersService,
  ) {
    super();
  }

  @Mutation(() => Organization, { name: `createOrganization` })
  async create(
    @CurrentSession() requestUser: User,
    @Args('data', { type: () => CreateOrganizationDto })
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    const hostUser = await this.userService.findOne(requestUser.id, {
      relations: ['organization'],
    });
    if (ownOrganization(hostUser)) {
      throw new BadRequestException('User already own an organization.');
    }

    return this.service.create({ owner: hostUser, ...data });
  }
}
