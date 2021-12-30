import { Injectable } from '@nestjs/common';
import {
  CoachApplicationDto,
  EditCoachApplicationDto,
} from '../dto/coachApplication.dto';
import { DocumentDto } from '../dto/document.dto';
import { CoachApplication } from '../models/coachApplication.model';
import { DocumentService } from './document.service';

@Injectable()
export class CoachApplicationService {
  constructor(private documentService: DocumentService) {}

  async createCoachApplication(
    coachApplicationData: CoachApplicationDto,
  ): Promise<CoachApplication> {
    const { documents, ...data } = coachApplicationData;
    const coachApplication = await CoachApplication.create({
      ...data,
    });

    if (documents?.length) {
      const documentsData = documents.map((document) => ({
        ...document,
        coachApplication: coachApplication.id,
      }));

      await this.documentService.bulkCreateDocument(documentsData);
    }

    return coachApplication;
  }

  async editCoachApplication(
    id: number,
    coachApplicationData: EditCoachApplicationDto,
  ): Promise<CoachApplication> {
    return CoachApplication.update(
      { ...coachApplicationData },
      { where: { id } },
    )[1];
  }

  async bulkEditCoachApplications(
    ids: Array<number>,
    coachApplicationData: EditCoachApplicationDto,
  ): Promise<[number, CoachApplication[]]> {
    return CoachApplication.update(
      { ...coachApplicationData },
      { where: { id: ids } },
    );
  }

  async deleteCoachApplication(id: number): Promise<number> {
    return CoachApplication.destroy({ where: { id } });
  }

  async bulkDeleteCoachApplications(ids: Array<number>): Promise<number> {
    return CoachApplication.destroy({ where: { id: ids } });
  }

  async getCoachApplication(id: number): Promise<CoachApplication> {
    return CoachApplication.findByPk(id);
  }

  async getCoachApplications(where: object): Promise<CoachApplication[]> {
    return CoachApplication.findAll({ where });
  }
}
