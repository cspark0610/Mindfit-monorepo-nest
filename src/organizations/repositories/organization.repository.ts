import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Organization } from 'src/organizations/models/organization.model';

@EntityRepository(Organization)
export class OrganizationRepository extends BaseRepository<Organization> {
  getQueryBuilder(): SelectQueryBuilder<Organization> {
    return this.repository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.owner', 'owner')
      .leftJoinAndSelect('organization.coachees', 'coachees')
      .leftJoinAndSelect('coachees.user', 'user');
  }
}
