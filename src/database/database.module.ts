import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachApplication } from 'src/coaching/models/coachApplication.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachNote } from 'src/coaching/models/coachNote.model';
import { Document } from 'src/coaching/models/document.model';
import config from 'src/config/config';
import { CoreConfig } from 'src/config/models/coreConfig.model';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { Organization } from 'src/users/models/organization.model';
import { User } from 'src/users/models/users.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, username, password, database } =
          configService.database;

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [
            CoreConfig,
            User,
            Organization,
            CoachingSession,
            Coach,
            CoachApplication,
            Coachee,
            CoacheeEvaluation,
            CoachingArea,
            CoachNote,
            Document,
            CoachAgenda,
            CoachAgendaDay,
            CoachAppointment,
            SatBasic,
            SatBasicSection,
            SatBasicQuestion,
            SatBasicAnswer,
            SatReport,
            SatSectionResult,
            SatReportQuestion,
          ],
          synchronize: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
