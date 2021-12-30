import { Injectable } from '@nestjs/common';
import { DocumentDto } from '../dto/document.dto';
import { Document } from '../models/document.model';

@Injectable()
export class DocumentService {
  async createDocument(documentData: DocumentDto): Promise<Document> {
    return Document.create({ ...documentData });
  }

  async bulkCreateDocument(documentsData: DocumentDto[]): Promise<Document[]> {
    return Document.bulkCreate(documentsData);
  }

  async editDocument(id: number, documentData: DocumentDto): Promise<Document> {
    return Document.update({ ...documentData }, { where: { id } })[1];
  }

  async bulkEditDocuments(
    ids: Array<number>,
    documentData: DocumentDto,
  ): Promise<[number, Document[]]> {
    return Document.update({ ...documentData }, { where: { id: ids } });
  }

  async deleteDocument(id: number): Promise<number> {
    return Document.destroy({ where: { id } });
  }

  async bulkDeleteDocuments(ids: Array<number>): Promise<number> {
    return Document.destroy({ where: { id: ids } });
  }

  async getDocument(id: number): Promise<Document> {
    return Document.findByPk(id);
  }

  async getDocuments(where: object): Promise<Document[]> {
    return Document.findAll({ where });
  }
}
