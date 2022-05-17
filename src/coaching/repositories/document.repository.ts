import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Document } from 'src/coaching/models/document.model';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

@EntityRepository(Document)
export class DocumentRepository extends BaseRepository<Document> {
  getQueryBuilder(
    relations: QueryRelationsType = { ref: 'document', relations: [] },
  ): SelectQueryBuilder<Document> {
    return super.getQueryBuilder(relations);
  }
}
