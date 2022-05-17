import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { SatReportDto } from 'src/evaluationTests/dto/satReport.dto';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatReportRepository } from 'src/evaluationTests/repositories/satReport.repository';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { SatReportQuestionsService } from 'src/evaluationTests/services/satReportQuestion.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { User } from 'src/users/models/users.model';

@Injectable()
export class SatReportsService extends BaseService<SatReport> {
  constructor(
    protected readonly repository: SatReportRepository,
    private satReportQuestionService: SatReportQuestionsService,
    private satSectionResultService: SatSectionResultsService,
    private satBasicService: SatBasicService,
    private satBasicSectionService: SatBasicSectionsService,
    private satBasicAnswerservice: SatBasicAnswersService,
    private satBasicQuestionService: SatBasicQuestionsService,
    private evaluationService: SatReportEvaluationService,
  ) {
    super();
  }

  //TODO Refactor
  /**
   * Create a Sat Report with the models related to it
   */
  async createFullReport(user: User, data: SatReportDto): Promise<SatReport> {
    const satRealized = await this.satBasicService.findOne({
      id: data.satRealizedId,
    });
    const satReport = await this.create({ user, satRealized, ...data });

    await Promise.all(
      data.sectionsResult.map(async (sectionResult) => {
        const satBasicSection = await this.satBasicSectionService.findOne({
          id: sectionResult.section,
        });
        const sectionResultEntity = await this.satSectionResultService.create({
          satReport,
          section: satBasicSection,
        });

        await Promise.all(
          sectionResult.questions.map(async (reportQuestion) => {
            const satBasicQuestion = await this.satBasicQuestionService.findOne(
              {
                id: reportQuestion.question,
              },
            );
            const answersSelected =
              await this.satBasicAnswerservice.getAnswersByIds({
                ids: reportQuestion.answersSelected,
              });

            await this.satReportQuestionService.create({
              section: sectionResultEntity,
              question: satBasicQuestion,
              answersSelected,
            });
          }),
        );
      }),
    );

    const result = await this.findOne({ id: satReport.id });

    // Update the report with the calculation of results
    return this.update(result.id, {
      result: await this.evaluationService.getSatResult(result.id),
    });
  }

  async getLastSatReportByUser({
    userId,
    relations,
  }: {
    userId: number;
    relations?: QueryRelationsType;
  }) {
    return this.repository.getLastSatReportByUser({ userId, relations });
  }

  async getLastSatReportByCoachee({
    coacheeId,
    relations,
  }: {
    coacheeId: number;
    relations?: QueryRelationsType;
  }) {
    return this.repository.getLastSatReportByCoachee({ coacheeId, relations });
  }

  async getSatReportByCoacheeIdAndDateRange({
    coacheeId,
    from,
    to,
    relations,
  }: {
    coacheeId: number;
    from: Date;
    to: Date;
    relations?: QueryRelationsType;
  }): Promise<SatReport[]> {
    return this.repository.getSatReportByCoacheeIdAndDateRange({
      coacheeId,
      from,
      to,
      relations,
    });
  }

  async getSatReportByCoacheesIds({
    coacheesId,
    relations,
  }: {
    coacheesId: number[];
    relations?: QueryRelationsType;
  }) {
    return this.repository.getSatReportByCoacheesIds({ coacheesId, relations });
  }
}
