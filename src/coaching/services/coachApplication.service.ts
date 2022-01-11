import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CoachApplicationDto,
  EditCoachApplicationDto,
} from '../dto/coachApplication.dto';
import { CoachApplication } from '../models/coachApplication.model';
import { DocumentService } from './document.service';

@Injectable()
export class CoachApplicationService {
  constructor(
    @InjectRepository(CoachApplication)
    private coachApplicationRepository: Repository<CoachApplication>,
    private documentService: DocumentService,
  ) {}

  async createCoachApplication(
    coachApplicationData: CoachApplicationDto,
  ): Promise<CoachApplication> {
    const { documents } = coachApplicationData;

    const data = await CoachApplicationDto.from(coachApplicationData);

    const coachApplication = await this.coachApplicationRepository.save(data);

    if (Array.isArray(documents)) {
      const documentsData = documents.map((document) => ({
        ...document,
        coachApplicationId: coachApplication.id,
      }));
      await this.documentService.bulkCreateDocument(documentsData);
    }

    return coachApplication;
  }

  // async editCoachApplication(
  //   id: number,
  //   coachApplicationData: EditCoachApplicationDto,
  // ): Promise<CoachApplication> {
  //   return CoachApplication.update(
  //     { ...coachApplicationData },
  //     { where: { id } },
  //   )[1];
  // }
  // async bulkEditCoachApplications(
  //   ids: Array<number>,
  //   coachApplicationData: EditCoachApplicationDto,
  // ): Promise<[number, CoachApplication[]]> {
  //   return CoachApplication.update(
  //     { ...coachApplicationData },
  //     { where: { id: ids } },
  //   );
  // }
  // async deleteCoachApplication(id: number): Promise<number> {
  //   return CoachApplication.destroy({ where: { id } });
  // }
  // async bulkDeleteCoachApplications(ids: Array<number>): Promise<number> {
  //   return CoachApplication.destroy({ where: { id: ids } });
  // }
  // async getCoachApplication(id: number): Promise<CoachApplication> {
  //   return CoachApplication.findByPk(id);
  // }
  // async getCoachApplications(where: object): Promise<CoachApplication[]> {
  //   return CoachApplication.findAll({ where });
  // }
}
