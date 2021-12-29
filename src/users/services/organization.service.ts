import { Injectable } from '@nestjs/common';
import { EditOrganizationDto, OrganizationDto } from '../dto/organization.dto';
import { Organization } from '../models/organization.model';
import { User } from '../models/users.model';

@Injectable()
export class OrganizationService {
  async createOrganization(
    organizationData: OrganizationDto,
  ): Promise<Organization> {
    return Organization.create({ ...organizationData });
  }

  async editOrganization(
    id: number,
    organizationData: EditOrganizationDto,
  ): Promise<Organization> {
    return Organization.update({ ...organizationData }, { where: { id } })[1];
  }

  async bulkEditOrganizations(
    ids: Array<number>,
    organizationData: EditOrganizationDto,
  ): Promise<[number, Organization[]]> {
    return Organization.update({ ...organizationData }, { where: { id: ids } });
  }

  async getOrgaizations(where: object): Promise<Organization[]> {
    return Organization.findAll({ where });
  }

  async getOrganization(id: number): Promise<Organization> {
    return Organization.findByPk(id);
  }
  async deactivateOrganization(id: number): Promise<Organization> {
    return Organization.update({ isActive: false }, { where: { id } })[1];
  }

  async deleteOrganization(id: number): Promise<number> {
    return User.destroy({ where: { id } });
  }

  async bulkDeleteOrganizations(ids: Array<number>): Promise<number> {
    return Organization.destroy({ where: { id: ids } });
  }
}
