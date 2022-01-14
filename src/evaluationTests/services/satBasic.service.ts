import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Repository } from 'typeorm';
import { SatBasicDto } from '../dto/satBasic.dto';
import { SatBasic } from '../models/satBasic.model';

@Injectable()
export class SatBasicService extends BaseService<SatBasic> {
  constructor(
    @InjectRepository(SatBasic)
    protected readonly repository: Repository<SatBasic>,
    private satBasicSectionService: SatBasicSectionService,
  ) {
    super();
  }

  asynccreateFullTest(data: SatBasicDto): Promise<SatBasic> {
    const satTest = this.repository.create(data);

    data.satBasicSections.forEach(async ({ title, questions }) => {
      const section = await this.satSectionService.create({ satTest, title });

      questions.forEach(async ({ satBasicAnswers: answers, ...data }) => {
        const question = await this.satQuestionService.create({
          section,
          ...data,
        });

        answers.forEach(async (answer) => {
          return await this.satAnswerService.create({ question, ...answer });
        });
      });
    });

    return null as any;
  }
}
