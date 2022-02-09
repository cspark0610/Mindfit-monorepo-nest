import { Injectable } from '@nestjs/common';
import { DocumentDto } from 'src/coaching/dto/document.dto';
import { Document } from 'src/coaching/models/document.model';
import { DocumentRepository } from 'src/coaching/repositories/document.repository';

@Injectable()
export class DocumentService {
  constructor(private documentRepository: DocumentRepository) {}

  async createDocument(documentData: DocumentDto): Promise<Document> {
    const data = await DocumentDto.from(documentData);
    return this.documentRepository.create(data);
  }
  async bulkCreateDocument(documentsData: DocumentDto[]): Promise<Document[]> {
    const data = await DocumentDto.fromArray(documentsData);
    return this.documentRepository.createMany(data);
  }
  editDocument(id: number, documentData: DocumentDto): Promise<Document> {
    return this.documentRepository.update(id, documentData);
  }

  editDocuments(
    ids: Array<number>,
    documentData: DocumentDto,
  ): Promise<Document[]> {
    return this.documentRepository.updateMany(ids, documentData);
  }

  deleteDocuments(id: number | Array<number>): Promise<number> {
    return this.documentRepository.delete(id);
  }

  getDocument(id: number): Promise<Document> {
    return this.documentRepository.findOneBy({ id });
  }

  getDocuments(where: Partial<Document>): Promise<Document[]> {
    return this.documentRepository.findAll(where);
  }
}
