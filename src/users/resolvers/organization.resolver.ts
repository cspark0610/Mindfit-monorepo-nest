import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  CreateOrganizationDto,
  EditOrganizationDto,
} from 'src/users/dto/organization.dto';
import { Organization } from 'src/users/models/organization.model';
import { OrganizationService } from 'src/users/services/organization.service';
import { UsersService } from 'src/users/services/users.service';
import { ownOrganization } from 'src/users/validators/users.validators';

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
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => CreateOrganizationDto })
    data: CreateOrganizationDto,
  ): Promise<Organization> {
    console.log('AQUI ESTOY');
    const hostUser = await this.userService.findOne(session.userId);
    console.log('AQUI NO');

    if (ownOrganization(hostUser)) {
      throw new BadRequestException('User already own an organization.');
    }

    return this.service.create({ owner: hostUser, ...data });
  }
}
