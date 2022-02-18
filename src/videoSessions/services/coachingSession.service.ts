import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
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
    @Inject(forwardRef(() => CoachAppointmentService))
    private coachAppointmentService: CoachAppointmentService,
  ) {
    super();
  }

  private generateSessionInfo({
    coachId,
    coacheeId,
    userId,
  }: {
    coachId: number;
    coacheeId: number;
    userId: number;
  }): CoachingSessionAccessDto {
    return {
      videoSessionChannel: `session-${coachId}-${coacheeId}`,
      chatSessionChannel: `chat-${coachId}-${coacheeId}`,
      tokens: {
        rtcToken: this.agoraService.getAgoraRtcToken(
          {
            channel: `session-${coachId}-${coacheeId}`,
            role: AgoraRoles.SUBSCRIBER,
          },
          userId,
        ),
        rtmToken: this.agoraService.getAgoraRtmToken(userId),
      },
    };
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

    const coachingSession = await this.repository.update(sessionId, {
      isCoacheeInSession: true,
    });

    if (
      coachingSession.isCoachInSession &&
      coachingSession.isCoacheeInSession
    ) {
      this.coachAppointmentService.update(
        coachingSession.appointmentRelated.id,
        { accomplished: true },
      );
    }

    return this.generateSessionInfo({
      userId,
      coachId: session.coach.id,
      coacheeId: session.coachee.id,
    });
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

    const coachingSession = await this.repository.update(sessionId, {
      isCoachInSession: true,
    });

    if (
      coachingSession.isCoachInSession &&
      coachingSession.isCoacheeInSession
    ) {
      this.coachAppointmentService.update(
        coachingSession.appointmentRelated.id,
        { accomplished: true },
      );
    }

    return this.generateSessionInfo({
      userId,
      coachId: session.coach.id,
      coacheeId: session.coachee.id,
    });
  }
}
