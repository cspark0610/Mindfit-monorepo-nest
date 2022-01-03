import { Injectable } from '@nestjs/common';
import { CoachingSessionDto } from '../dto/coachingSession.dto';
import { CoachingSession } from '../models/coachingSession.model';

@Injectable()
export class CoachingSessionService {
  async createCoachingSession(
    coachingSessionData: CoachingSessionDto,
  ): Promise<CoachingSession> {
    return CoachingSession.create({ ...coachingSessionData });
  }

  async editCoachingSession(
    id: number,
    coachingSessionData: CoachingSessionDto,
  ): Promise<CoachingSession> {
    return CoachingSession.update(
      { ...coachingSessionData },
      { where: { id } },
    )[1];
  }

  async bulkEditCoachingSessions(
    ids: Array<number>,
    coachingSessionData: CoachingSessionDto,
  ): Promise<[number, CoachingSession[]]> {
    return CoachingSession.update(
      { ...coachingSessionData },
      { where: { id: ids } },
    );
  }

  async deactivateCoachingSession(id: number): Promise<CoachingSession> {
    return CoachingSession.update({ isActive: false }, { where: { id } })[1];
  }

  async deleteCoachingSession(id: number): Promise<number> {
    return CoachingSession.destroy({ where: { id } });
  }

  async bulkDeleteCoachingSessions(ids: Array<number>): Promise<number> {
    return CoachingSession.destroy({ where: { id: ids } });
  }

  async getCoachingSession(id: number): Promise<CoachingSession> {
    return CoachingSession.findByPk(id);
  }

  async getCoachingSessions(where: object): Promise<CoachingSession[]> {
    return CoachingSession.findAll({ where });
  }
}
