import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  EditSatBasicQuestionDto,
  SatBasicQuestionDto,
} from '../dto/satBasicQuestion.dto';

import { SatBasicQuestion } from '../models/satBasicQuestion.model';
import { SatBasicQuestionsService } from '../services/satBasicQuestion.service';

@Resolver(() => SatBasicQuestion)
@UseGuards(JwtAuthGuard)
export class SatBasicQuestionsResolver extends BaseResolver(SatBasicQuestion, {
  create: SatBasicQuestionDto,
  update: EditSatBasicQuestionDto,
}) {
  constructor(protected readonly service: SatBasicQuestionsService) {
    super();
  }
  // TODO Validate only staff and superuser
}
