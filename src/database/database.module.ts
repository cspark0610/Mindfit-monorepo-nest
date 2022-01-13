import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachAgenda } from '../agenda/models/coachAgenda.model';
import { CoachAgendaDay } from '../agenda/models/coachAgendaDay.model';
import { CoachAppointment } from '../agenda/models/coachAppointment.model';
import { Coach } from '../coaching/models/coach.model';
import { CoachApplication } from '../coaching/models/coachApplication.model';
import { Coachee } from '../coaching/models/coachee.model';
import { CoacheeEvaluation } from '../coaching/models/coacheeEvaluation.model';
import { CoachingArea } from '../coaching/models/coachingArea.model';
import { CoachNote } from '../coaching/models/coachNote.model';
import { Document } from '../coaching/models/document.model';
import { CoreConfig } from '../config/models/coreConfig.model';
import { Organization } from '../users/models/organization.model';
import { User } from '../users/models/users.model';
import { CoachingSession } from '../videoSessions/models/coachingSession.model';
import config from '../config/config';

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
          ],
          synchronize: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
