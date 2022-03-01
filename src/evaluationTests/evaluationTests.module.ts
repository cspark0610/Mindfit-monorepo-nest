import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachingModule } from 'src/coaching/coaching.module';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { SatBasicRepository } from 'src/evaluationTests/repositories/satBasic.repository';
import { SatBasicAnswerRepository } from 'src/evaluationTests/repositories/satBasicAnswer.repository';
import { SatBasicQuestionRepository } from 'src/evaluationTests/repositories/satBasicQuestion.repository';
import { SatBasicSectionRepository } from 'src/evaluationTests/repositories/satBasicSection.repository';
import { SatReportRepository } from 'src/evaluationTests/repositories/satReport.repository';
import { SatReportQuestionRepository } from 'src/evaluationTests/repositories/satReportQuestion.repository';
import { SatSectionResultRepository } from 'src/evaluationTests/repositories/satSectionResult.repository';
import { SatBasicsResolver } from 'src/evaluationTests/resolvers/satBasic.resolver';
import { SatBasicAnswersResolver } from 'src/evaluationTests/resolvers/satBasicAnswer.resolver';
import { SatBasicQuestionsResolver } from 'src/evaluationTests/resolvers/satBasicQuestion.resolver';
import { SatBasicSectionsResolver } from 'src/evaluationTests/resolvers/satBasicSection.resolver';
import { SatReportsResolver } from 'src/evaluationTests/resolvers/satReport.resolver';
import { EmotionalStateEvaluationService } from 'src/evaluationTests/services/evaluation/emotionalStateEvaluation.service';
import { HappinessEvaluationService } from 'src/evaluationTests/services/evaluation/happinessEvaluation.service';
import { HealtEvaluationService } from 'src/evaluationTests/services/evaluation/healtEvaluation.service';
import { LeadershipEvaluationService } from 'src/evaluationTests/services/evaluation/leadershipEvaluation.service';
import { LifePurposeEvaluationService } from 'src/evaluationTests/services/evaluation/lifePurposeEvaluation.service';
import { SubordinateEvaluationService } from 'src/evaluationTests/services/evaluation/subordinateEvaluation.service';
import { TeamWorkEvaluationService } from 'src/evaluationTests/services/evaluation/teamworkEvaluation.service';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { SatReportQuestionsService } from 'src/evaluationTests/services/satReportQuestion.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { UsersModule } from 'src/users/users.module';

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
      SatBasicRepository,
      SatBasicAnswerRepository,
      SatBasicQuestionRepository,
      SatBasicSectionRepository,
      SatReportRepository,
      SatReportQuestionRepository,
      SatSectionResultRepository,
    ]),
    UsersModule,
    forwardRef(() => CoachingModule),
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
  exports: [SatReportsService],
})
export class EvaluationTestsModule {}
