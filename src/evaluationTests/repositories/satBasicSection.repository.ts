import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';

@EntityRepository(SatBasicSection)
export class SatBasicSectionRepository extends BaseRepository<SatBasicSection> {
  getQueryBuilder(): SelectQueryBuilder<SatBasicSection> {
    return this.repository
      .createQueryBuilder('satBasicSection')
      .leftJoinAndSelect('satBasicSection.satTest', 'satTest')
      .leftJoinAndSelect('satBasicSection.questions', 'questions')
      .leftJoinAndSelect('satBasicSection.sectionResults', 'sectionResults');
  }
}
