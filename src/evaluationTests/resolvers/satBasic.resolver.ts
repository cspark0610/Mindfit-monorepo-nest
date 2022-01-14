import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Repository } from 'typeorm';
import { SatBasicDto } from '../dto/satBasic.dto';
import { SatBasic } from '../models/satBasic.model';
import { SatBasicService } from '../services/satBasic.service';
import { SatBasicQuestionsService } from '../services/satBasicQuestion.service';
import { SatBasicAnswersService } from '../services/satBasicQuestion.service copy';
import { SatBasicSectionsService } from '../services/satBasicSection.service';

@Resolver(() => SatBasic)
@UseGuards(JwtAuthGuard)
export class SatBasicsResolver extends BaseResolver(SatBasic, {
  create: SatBasicDto,
  update: SatBasicDto,
}) {
  constructor(
    protected readonly service: SatBasicService,
    private satSectionService: SatBasicSectionsService,
    private satQuestionService: SatBasicQuestionsService,
    private satAnswerService: SatBasicAnswersService,

    @InjectRepository(SatBasic)
    protected readonly repository: Repository<SatBasic>,
  ) {
    super();
  }

  @Mutation(() => SatBasic, { name: 'createSatBasic' })
  async create(
    @Args('data', { type: () => SatBasicDto })
    data: SatBasicDto,
  ): Promise<SatBasic> {
    // console.log(data);
    // console.log(data.satBasicSections);

    const satTest = await this.service.create(data);

    const result = await this.service.findOne(satTest.id, {
      relations: ['sections'],
    });
    return result;
  }
}
