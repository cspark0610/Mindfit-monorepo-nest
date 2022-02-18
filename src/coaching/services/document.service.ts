import { Injectable } from '@nestjs/common';
import { Document } from 'src/coaching/models/document.model';
import { DocumentRepository } from 'src/coaching/repositories/document.repository';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class DocumentService extends BaseService<Document> {
  constructor(protected documentRepository: DocumentRepository) {
    super();
  }
}
