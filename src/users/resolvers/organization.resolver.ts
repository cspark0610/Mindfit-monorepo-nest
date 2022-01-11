import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindManyOptions } from 'typeorm';
import { EditOrganizationDto, OrganizationDto } from '../dto/organization.dto';
import { Organization } from '../models/organization.model';
import { OrganizationService } from '../services/organization.service';

@Resolver(() => Organization)
export class OrganizationsResolver {
  constructor(private organizationService: OrganizationService) {}

  @Query(() => Organization)
  async getOrganization(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<Organization> {
    return this.organizationService.getOrganization(id);
  }

  @Query(() => [Organization])
  async getOrganizations(
    @Args('where', { type: () => String, nullable: true })
    where: FindManyOptions<Organization>,
  ): Promise<Organization[]> {
    return this.organizationService.getOrganizations(where);
  }

  @Mutation(() => Organization)
  async createOrganization(
    @Args('data', { type: () => OrganizationDto }) data: OrganizationDto,
  ): Promise<Organization> {
    //TODO take user from request
    const org = await this.organizationService.createOrganization(data);

    return org;
  }

  @Mutation(() => Organization)
  async editOrganization(
    @Args('id', { type: () => Number }) id: number,
    @Args('data', { type: () => EditOrganizationDto })
    data: EditOrganizationDto,
  ): Promise<Organization | Organization[]> {
    return this.organizationService.editOrganizations(id, data);
  }

  @Mutation(() => [Organization])
  async editOrganizations(
    @Args('ids', { type: () => [Number] }) ids: number[],
    @Args('data', { type: () => EditOrganizationDto })
    data: EditOrganizationDto,
  ): Promise<Organization | Organization[]> {
    return this.organizationService.editOrganizations(ids, data);
  }

  @Mutation(() => Organization)
  async activateOrganization(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<Organization | Organization[]> {
    return this.organizationService.editOrganizations(id, { isActive: true });
  }

  @Mutation(() => Organization)
  async deactivateOrganization(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<Organization | Organization[]> {
    return this.organizationService.editOrganizations(id, { isActive: false });
  }

  @Mutation(() => Number)
  async deleteOrganization(
    @Args('id', { type: () => Number }) id: number | number,
  ): Promise<number> {
    return this.organizationService.deleteOrganizations(id);
  }

  @Mutation(() => Number)
  async deleteOrganizations(
    @Args('ids', { type: () => [Number] }) ids: number | number[],
  ): Promise<number> {
    return this.organizationService.deleteOrganizations(ids);
  }
}
