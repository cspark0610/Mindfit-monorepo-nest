import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Organization } from 'src/organizations/models/organization.model';
import { Coachee } from 'src/coaching/models/coachee.model';

@EntityRepository(Organization)
export class OrganizationRepository extends BaseRepository<Organization> {
  getQueryBuilder(): SelectQueryBuilder<Organization> {
    return this.repository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.owner', 'owner')
      .leftJoinAndSelect('organization.coachees', 'coachees')
      .leftJoinAndSelect('coachees.user', 'user');
  }

  relationOrganizationWithCoachee(
    organization: Organization,
    coachee: Coachee,
  ): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(Organization, 'coachees') // field in Organization is called 'coachees'
      .of(organization) // or .of(organization.id)
      .add(coachee); // as its is a one to many relation
  }
}
