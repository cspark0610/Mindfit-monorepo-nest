import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { Coach } from 'src/coaching/models/coach.model';

@EntityRepository(CoachAgenda)
export class CoachAgendaRepository extends BaseRepository<CoachAgenda> {
  getQueryBuilder(): SelectQueryBuilder<CoachAgenda> {
    return this.repository
      .createQueryBuilder('coachAgenda')
      .leftJoinAndSelect('coachAgenda.coach', 'coach')
      .leftJoinAndSelect('coachAgenda.coachAgendaDays', 'coachAgendaDays')
      .leftJoinAndSelect('coachAgenda.coachAppointments', 'coachAppointments');
  }
  relationQueryBuiler(coachAgenda: CoachAgenda, coach: Coach): Promise<void> {
    return this.repository
      .createQueryBuilder()
      .relation(CoachAgenda, 'coach')
      .of(coachAgenda) // or coachAgenda.id
      .set(coach); // as its a one-to-one relation
  }
}
