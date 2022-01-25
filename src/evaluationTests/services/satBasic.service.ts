import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatBasicDto } from '../dto/satBasic.dto';
import { SatBasic } from '../models/satBasic.model';
import { SatBasicQuestionsService } from './satBasicQuestion.service';
import { SatBasicAnswersService } from './satBasicAnswer.service';
import { SatBasicSectionsService } from './satBasicSection.service';

@Injectable()
export class SatBasicService extends BaseService<SatBasic> {
  constructor(
    @InjectRepository(SatBasic)
    protected readonly repository: Repository<SatBasic>,
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

    return this.findOne(satTest.id, { relations: ['sections'] });
  }
}
