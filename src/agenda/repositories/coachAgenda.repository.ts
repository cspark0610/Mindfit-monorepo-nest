import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';

@EntityRepository(CoachAgenda)
export class CoachAgendaRepository extends BaseRepository<CoachAgenda> {
  getQueryBuilder(): SelectQueryBuilder<CoachAgenda> {
    return this.repository
      .createQueryBuilder('coachAgenda')
      .leftJoinAndSelect('coachAgenda.coach', 'coach')
      .leftJoinAndSelect('coachAgenda.coachAgendaDays', 'coachAgendaDays')
      .leftJoinAndSelect('coachAgenda.coachAppointments', 'coachAppointments');
  }
}
