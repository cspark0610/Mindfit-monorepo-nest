import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  EditSatBasicAnswerDto,
  SatBasicAnswerDto,
} from 'src/evaluationTests/dto/satBasicAnswer.dto';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';

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

  @Query(() => [SatBasicAnswer])
  async getPositiveAnswers() {
    return this.service.getPositiveAnswers({ ids: [690, 691, 698] });
  }
}
