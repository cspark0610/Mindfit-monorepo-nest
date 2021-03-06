import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { SatBasicDto } from 'src/evaluationTests/dto/satBasic.dto';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicRepository } from 'src/evaluationTests/repositories/satBasic.repository';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
@Injectable()
export class SatBasicService extends BaseService<SatBasic> {
  constructor(
    protected readonly repository: SatBasicRepository,
    private satBasicSectionService: SatBasicSectionsService,
    private satBasicQuestionService: SatBasicQuestionsService,
    private satBasicAnswerService: SatBasicAnswersService,
  ) {
    super();
  }

  // TODO Order in SatBasic section, questions and answers

  async createFullTest(data: SatBasicDto): Promise<SatBasic> {
    const satTest = await this.create(data);

    // TODO Refactor
    await Promise.all(
      data.satBasicSections.map(async (section) => {
        const sectionEntity = await this.satBasicSectionService.create({
          satTest,
          title: section.title,
          codename: section.codename,
          order: section.order,
        });

        await Promise.all(
          section.questions.map(
            async ({ satBasicAnswers: answers, ...data }) => {
              const questionEntity = await this.satBasicQuestionService.create({
                section: sectionEntity,
                ...data,
              });

              await Promise.all(
                answers.map(async (answer) =>
                  this.satBasicAnswerService.create({
                    question: questionEntity,
                    ...answer,
                  }),
                ),
              );
            },
          ),
        );
      }),
    );

    return this.repository.findOneBy({ id: satTest.id });
  }
}
