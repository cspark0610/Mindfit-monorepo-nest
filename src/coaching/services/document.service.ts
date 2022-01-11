import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { DocumentDto } from '../dto/document.dto';
import { Document } from '../models/document.model';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async createDocument(documentData: DocumentDto): Promise<Document> {
    const data = await DocumentDto.from(documentData);
    return this.documentRepository.save(data);
  }
  async bulkCreateDocument(documentsData: DocumentDto[]): Promise<Document[]> {
    const data = await DocumentDto.fromArray(documentsData);
    return this.documentRepository.save(data);
  }
  async editDocuments(
    id: number | Array<number>,
    documentData: DocumentDto,
  ): Promise<Document> {
    const result = await this.documentRepository
      .createQueryBuilder()
      .update()
      .set({ ...documentData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();

    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteDocuments(id: number | Array<number>): Promise<number> {
    const result = await this.documentRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();

    return result.affected;
  }

  async getDocument(id: number): Promise<Document> {
    return this.documentRepository.findOne(id);
  }

  async getDocuments(where: FindManyOptions<Document>): Promise<Document[]> {
    return this.documentRepository.find(where);
  }
}
