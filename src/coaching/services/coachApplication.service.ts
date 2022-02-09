import { Injectable } from '@nestjs/common';
import { CoachApplicationDto } from 'src/coaching/dto/coachApplication.dto';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { CoachApplicationRepository } from 'src/coaching/repositories/coachApplication.repository';
import { DocumentService } from 'src/coaching/services/document.service';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class CoachApplicationService extends BaseService<CoachApplication> {
  constructor(
    protected readonly repository: CoachApplicationRepository,
    private documentService: DocumentService,
  ) {
    super();
  }

  async createFullCoachApplication(
    coachApplicationData: CoachApplicationDto,
  ): Promise<CoachApplication> {
    const { documents } = coachApplicationData;

    const data = await CoachApplicationDto.from(coachApplicationData);

    const coachApplication = await this.repository.create(data);

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
