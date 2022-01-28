import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { SatBasic } from './models/satBasic.model';
import { SatBasicAnswer } from './models/satBasicAnswer.model';
import { SatBasicQuestion } from './models/satBasicQuestion.model';
import { SatBasicSection } from './models/satBasicSection.model';
import { SatReport } from './models/satReport.model';
import { SatReportQuestion } from './models/satReportQuestion.model';
import { SatSectionResult } from './models/satSectionResult.model';
import { SatBasicsResolver } from './resolvers/satBasic.resolver';
import { SatBasicAnswersResolver } from './resolvers/satBasicAnswer.resolver';
import { SatBasicQuestionsResolver } from './resolvers/satBasicQuestion.resolver';
import { SatBasicSectionsResolver } from './resolvers/satBasicSection.resolver';
import { SatReportsResolver } from './resolvers/satReport.resolver';
import { EmotionalStateEvaluationService } from './services/evaluation/emotionalStateEvaluation.service';
import { HappinessEvaluationService } from './services/evaluation/happinessEvaluation.service';
import { HealtEvaluationService } from './services/evaluation/healtEvaluation.service';
import { LeadershipEvaluationService } from './services/evaluation/leadershipEvaluation.service';
import { LifePurposeEvaluationService } from './services/evaluation/lifePurposeEvaluation.service';
import { SubordinateEvaluationService } from './services/evaluation/subordinateEvaluation.service';
import { TeamWorkEvaluationService } from './services/evaluation/teamworkEvaluation.service';
import { SatBasicService } from './services/satBasic.service';
import { SatBasicAnswersService } from './services/satBasicAnswer.service';
import { SatBasicQuestionsService } from './services/satBasicQuestion.service';
import { SatBasicSectionsService } from './services/satBasicSection.service';
import { SatReportsService } from './services/satReport.service';
import { SatReportEvaluationService } from './services/satReportEvaluation.service';
import { SatReportQuestionsService } from './services/satReportQuestion.service';
import { SatSectionResultsService } from './services/satSectionResult.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SatBasic,
      SatBasicSection,
      SatBasicQuestion,
      SatBasicAnswer,
      SatReport,
      SatReportQuestion,
      SatSectionResult,
    ]),
    UsersModule,
  ],
  providers: [
    SatBasicService,
    SatBasicQuestionsService,
    SatBasicAnswersService,
    SatBasicSectionsService,
    SatBasicsResolver,
    SatBasicSectionsResolver,
    SatBasicQuestionsResolver,
    SatBasicAnswersResolver,
    SatReportsService,
    SatReportsResolver,
    SatReportQuestionsService,
    SatSectionResultsService,
    SatReportEvaluationService,
    SubordinateEvaluationService,
    LifePurposeEvaluationService,
    LeadershipEvaluationService,
    HappinessEvaluationService,
    EmotionalStateEvaluationService,
    TeamWorkEvaluationService,
    HealtEvaluationService,
  ],
})
export class EvaluationTestsModule {}
