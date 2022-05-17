import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Organization } from 'src/organizations/models/organization.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(Organization)
export class OrganizationRepository extends BaseRepository<Organization> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'organization', relations: [] },
  ): SelectQueryBuilder<Organization> {
    return super.getQueryBuilder(relations);
  }

  getOrganizationByUserId({
    userId,
    relations,
  }: {
    userId: number;
    relations?: QueryRelationsType;
  }): Promise<Organization> {
    return this.getQueryBuilder(relations)
      .where('owner.id = :userId', { userId })
      .getOne();
  }
}
