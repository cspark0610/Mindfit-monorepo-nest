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
import { SatReportsResolver } from './resolvers/satReport.resolver';
import { SatBasicService } from './services/satBasic.service';
import { SatBasicAnswersService } from './services/satBasicAnswer.service';
import { SatBasicQuestionsService } from './services/satBasicQuestion.service';
import { SatBasicSectionsService } from './services/satBasicSection.service';
import { SatReportsService } from './services/satReport.service';
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
    SatReportsService,
    SatReportsResolver,
    SatReportQuestionsService,
    SatSectionResultsService,
  ],
})
export class EvaluationTestsModule {}
