import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/users/models/users.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'user', relations: [] },
  ): SelectQueryBuilder<User> {
    return super.getQueryBuilder(relations);
  }

  getUserByOrganizationId(
    organizationId: number,
    relations?: QueryRelationsType,
  ): Promise<User> {
    return this.getQueryBuilder(relations)
      .where('organization.id = :organizationId', {
        organizationId,
      })
      .getOne();
  }
}
