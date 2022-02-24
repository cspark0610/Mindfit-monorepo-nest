import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';

export interface IHistoricalCoacheeData {
  coachingAppointments: CoachAppointment[];
  coacheeEvaluations: CoacheeEvaluation[];
}
