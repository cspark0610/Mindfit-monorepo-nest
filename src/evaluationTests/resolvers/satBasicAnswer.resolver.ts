import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  EditSatBasicAnswerDto,
  SatBasicAnswerDto,
} from '../dto/satBasicAnswer.dto';
import { SatBasicAnswer } from '../models/satBasicAnswer.model';

import { SatBasicAnswersService } from '../services/satBasicAnswer.service';

@Resolver(() => SatBasicAnswer)
@UseGuards(JwtAuthGuard)
export class SatBasicAnswersResolver extends BaseResolver(SatBasicAnswer, {
  create: SatBasicAnswerDto,
  update: EditSatBasicAnswerDto,
}) {
  constructor(protected readonly service: SatBasicAnswersService) {
    super();
  }
  // TODO Validate only staff and superuser
}
