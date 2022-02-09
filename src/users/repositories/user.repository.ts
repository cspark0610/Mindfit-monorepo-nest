import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from 'src/users/models/users.model';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  getQueryBuilder(): SelectQueryBuilder<User> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.coachee', 'coachee')
      .leftJoinAndSelect('user.coach', 'coach')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.testResults', 'testResults');
  }
}
