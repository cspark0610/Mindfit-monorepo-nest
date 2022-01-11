import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CoachingSessionDto } from '../dto/coachingSession.dto';
import { CoachingSession } from '../models/coachingSession.model';

@Injectable()
export class CoachingSessionService {
  constructor(
    @InjectRepository(CoachingSession)
    private coachingSessionRepository: Repository<CoachingSession>,
  ) {}

  async createCoachingSession(
    coachingSessionData: CoachingSessionDto,
  ): Promise<CoachingSession> {
    const data = await CoachingSessionDto.from(coachingSessionData);

    return this.coachingSessionRepository.save(data);
  }
  async editCoachingSessions(
    id: number | Array<number>,
    coachingSessionData: CoachingSessionDto,
  ): Promise<CoachingSession> {
    const result = await this.coachingSessionRepository
      .createQueryBuilder()
      .update()
      .set({ ...coachingSessionData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();

    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoachingSessions(id: number | Array<number>): Promise<number> {
    const result = await this.coachingSessionRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }

  async getCoachingSession(id: number): Promise<CoachingSession> {
    return this.coachingSessionRepository.findOne(id);
  }

  async getCoachingSessions(
    where: FindManyOptions<CoachingSession>,
  ): Promise<CoachingSession[]> {
    return this.coachingSessionRepository.find(where);
  }
}
