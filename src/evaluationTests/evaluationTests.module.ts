import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SatBasic } from './models/satBasic.model';
import { SatBasicAnswer } from './models/satBasicAnswer.model';
import { SatBasicQuestion } from './models/satBasicQuestion.model';
import { SatBasicSection } from './models/satBasicSection.model';
import { SatBasicsResolver } from './resolvers/satBasic.resolver';
import { SatBasicService } from './services/satBasic.service';
import { SatBasicQuestionsService } from './services/satBasicQuestion.service';
import { SatBasicAnswersService } from './services/satBasicQuestion.service copy';
import { SatBasicSectionsService } from './services/satBasicSection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SatBasic,
      SatBasicSection,
      SatBasicQuestion,
      SatBasicAnswer,
    ]),
  ],
  providers: [
    SatBasicService,
    SatBasicQuestionsService,
    SatBasicAnswersService,
    SatBasicSectionsService,
    SatBasicsResolver,
  ],
})
export class EvaluationTestsModule {}
