import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Document } from 'src/coaching/models/document.model';

@EntityRepository(Document)
export class DocumentRepository extends BaseRepository<Document> {
  getQueryBuilder(): SelectQueryBuilder<Document> {
    return this.repository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.coachApplication', 'coachApplication');
  }
}
