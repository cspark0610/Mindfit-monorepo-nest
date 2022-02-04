import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { SatReportDto } from 'src/evaluationTests/dto/satReport.dto';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
import { SatReportQuestionsService } from 'src/evaluationTests/services/satReportQuestion.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { User } from 'src/users/models/users.model';
import { In, Repository } from 'typeorm';
@Injectable()
export class SatReportsService extends BaseService<SatReport> {
  constructor(
    @InjectRepository(SatReport)
    protected readonly repository: Repository<SatReport>,
    private satReportQuestionService: SatReportQuestionsService,
    private satSectionResultService: SatSectionResultsService,
    private satBasicService: SatBasicService,
    private satBasicSectionService: SatBasicSectionsService,
    private satBasicAnswerservice: SatBasicAnswersService,
    private satBasicQuestionService: SatBasicQuestionsService,
  ) {
    super();
  }

  //TODO Refactor
  /**
   * Create a Sat Report with the models related to it
   */
  async createFullReport(user: User, data: SatReportDto): Promise<SatReport> {
    const satRealized = await this.satBasicService.findOne(data.satRealizedId);
    const satReport = await this.create({ user, satRealized, ...data });

    await Promise.all(
      data.sectionsResult.map(async (sectionResult) => {
        const satBasicSection = await this.satBasicSectionService.findOne(
          sectionResult.section,
        );

        const sectionResultEntity = await this.satSectionResultService.create({
          satReport,
          section: satBasicSection,
        });

        await Promise.all(
          sectionResult.questions.map(async (reportQuestion) => {
            const satBasicQuestion = await this.satBasicQuestionService.findOne(
              reportQuestion.question,
            );

            const answersSelected = await this.satBasicAnswerservice.findAll({
              where: { id: In(reportQuestion.answersSelected) },
            });

            await this.satReportQuestionService.create({
              section: sectionResultEntity,
              question: satBasicQuestion,
              answersSelected: answersSelected,
            });
          }),
        );
      }),
    );
    const result = await this.findOne(satReport.id, {
      relations: [],
    });

    return result;
  }
}
