import { HttpStatus, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { AgoraRoles } from 'src/agora/enum/agoraRoles.enum';
import { AgoraService } from 'src/agora/services/agora.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { CoachingSessionAccessDto } from 'src/videoSessions/dto/coachingSessionAccess.dto';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionRepository } from 'src/videoSessions/repositories/coachingSession.repository';

@Injectable()
export class CoachingSessionService extends BaseService<CoachingSession> {
  constructor(
    protected readonly repository: CoachingSessionRepository,
    private agoraService: AgoraService,
  ) {
    super();
  }

  async getCoacheeSessionTokens(
    sessionId: number,
    userId: number,
  ): Promise<CoachingSessionAccessDto> {
    const session = await this.repository.findOneBy({ id: sessionId });

    const currentDate = dayjs();
    const startAppointmentDate = dayjs(session.appointmentRelated.startDate);

    if (currentDate.isBefore(startAppointmentDate) || !session.isCoachInSession)
      throw new MindfitException({
        error: 'Session is not started yet',
        errorCode: 'SESSION_NO_STARTED',
        statusCode: HttpStatus.UNAUTHORIZED,
      });

    await this.repository.update(sessionId, {
      isCoacheeInSession: true,
    });

    return {
      videoSessionChannel: `session-${session.coach.id}-${session.coachee.id}`,
      chatSessionChannel: `chat-${session.coach.id}-${session.coachee.id}`,
      tokens: {
        rtcToken: this.agoraService.getAgoraRtcToken(
          {
            channel: `session-${session.coach.id}-${session.coachee.id}`,
            role: AgoraRoles.SUBSCRIBER,
          },
          userId,
        ),
        rtmToken: this.agoraService.getAgoraRtmToken(userId),
      },
    };
  }

  async getCoachSessionTokens(
    sessionId: number,
    userId: number,
  ): Promise<CoachingSessionAccessDto> {
    const session = await this.repository.findOneBy({ id: sessionId });

    const currentDate = dayjs();
    const startAppointmentDate = dayjs(session.appointmentRelated.startDate);

    if (currentDate.isBefore(startAppointmentDate))
      throw new MindfitException({
        error: 'Session is not started yet',
        errorCode: 'SESSION_NO_STARTED',
        statusCode: HttpStatus.UNAUTHORIZED,
      });

    await this.repository.update(sessionId, {
      isCoachInSession: true,
    });

    return {
      videoSessionChannel: `session-${session.coach.id}-${session.coachee.id}`,
      chatSessionChannel: `chat-${session.coach.id}-${session.coachee.id}`,
      tokens: {
        rtcToken: this.agoraService.getAgoraRtcToken(
          {
            channel: `session-${session.coach.id}-${session.coachee.id}`,
            role: AgoraRoles.SUBSCRIBER,
          },
          userId,
        ),
        rtmToken: this.agoraService.getAgoraRtmToken(userId),
      },
    };
  }
}
