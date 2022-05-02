import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Organization } from 'src/organizations/models/organization.model';

const POSSIBLE_JOINS_FIELDS = ['coachees'];

@EntityRepository(Organization)
export class OrganizationRepository extends BaseRepository<Organization> {
  getDinamicQueryBuilder(
    fieldsArr: string[],
  ): SelectQueryBuilder<Organization> {
    const filtered = POSSIBLE_JOINS_FIELDS.filter((field) =>
      fieldsArr.includes(field),
    );

    const created = this.repository.createQueryBuilder('organization');
    filtered.forEach((field) => {
      created.leftJoinAndSelect(`organization.${field}`, field);
    });
    created
      .leftJoinAndSelect('organization.owner', 'owner')
      .leftJoinAndSelect('coachees.user', 'user')
      .leftJoinAndSelect('coachees.assignedCoach', 'assignedCoach')
      .leftJoinAndSelect('assignedCoach.user', 'assignedCoachUser');
    return created;
  }

  getQueryBuilder(): SelectQueryBuilder<Organization> {
    return this.repository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.owner', 'owner')
      .leftJoinAndSelect('organization.coachees', 'coachees')
      .leftJoinAndSelect('coachees.assignedCoach', 'coacheesAssignedCoach')
      .leftJoinAndSelect('coacheesAssignedCoach.user', 'assignedCoachUser')
      .leftJoinAndSelect('coachees.coachingAreas', 'coacheesCoachingAreas')
      .leftJoinAndSelect('coachees.user', 'user');
  }

  getOrganizationByUserId(userId: number): Promise<Organization> {
    return this.getQueryBuilder()
      .where('owner.id = :userId', { userId })
      .getOne();
  }

  getDinamicOrganizationProfile(
    userId: number,
    fieldsArr: string[],
  ): Promise<Organization> {
    return this.getDinamicQueryBuilder(fieldsArr)
      .where('owner.id = :userId', { userId })
      .getOne();
  }
}
