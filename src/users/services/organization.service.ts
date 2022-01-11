import { Injectable } from '@nestjs/common';
import { EditOrganizationDto, OrganizationDto } from '../dto/organization.dto';
import { Organization } from '../models/organization.model';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {}

  async createOrganization(
    organizationData: OrganizationDto,
  ): Promise<Organization> {
    const data = await OrganizationDto.from(organizationData);
    return this.organizationsRepository.save(data);
  }

  async editOrganizations(
    id: number | Array<number>,
    organizationData: EditOrganizationDto,
  ): Promise<Organization | Organization[]> {
    const result = await this.organizationsRepository
      .createQueryBuilder()
      .update()
      .set({ ...organizationData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();
    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async getOrganizations(
    where: FindManyOptions<Organization>,
  ): Promise<Organization[]> {
    return this.organizationsRepository.find(where);
  }

  async getOrganization(id: number): Promise<Organization> {
    return this.organizationsRepository.findOne(id);
  }

  async deleteOrganizations(id: number | Array<number>): Promise<number> {
    const result = await this.organizationsRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }
}
