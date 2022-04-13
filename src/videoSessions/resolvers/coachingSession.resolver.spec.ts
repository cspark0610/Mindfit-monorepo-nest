import { Test, TestingModule } from '@nestjs/testing';
import { CoachingSessionResolver } from 'src/videoSessions/resolvers/coachingSession.resolver';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { CoachingSessionAccess } from 'src/videoSessions/models/coachingSessionAccess.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { Roles } from 'src/users/enums/roles.enum';

describe('CoachingSessionResolver', () => {
  let resolver: CoachingSessionResolver;

  const agoraTokensMock = {
    rtcToken: 'TEST_RTC_TOKEN',
    rtmToken: 'TEST_RTM_TOKEN',
  };
  const coachingSessionMock = {
    id: 1,
    coach: { id: 1 } as Coach,
    coachee: { id: 1 } as Coachee,
    appointmentRelated: { id: 1, startDate: new Date() } as CoachAppointment,
    coachingSessionFeedback: { id: 1 } as CoachingSessionFeedback,
    remarks: 'TEST_REMARKS',
    coachFeedback: 'TEST_COACH_FEEDBACK',
    coachEvaluation: 'TEST_COACH_EVALUATION',
    coacheeFeedback: 'TEST_COACHEE_FEEDBACK',
    isCoachInSession: true,
    isCoacheeInSession: false,
  } as CoachingSession;

  const coachingSessionAccessMock = {
    coachingSession: coachingSessionMock,
    videoSessionChannel: `session-coachdId-coacheeId`,
    chatSessionChannel: `chat-coachId-coacheeId`,
    tokens: agoraTokensMock,
  } as CoachingSessionAccess;

  const sessionIdMock = coachingSessionMock.id;
  const sessionMock = {
    userId: 1,
    email: 'test@email.com',
    role: Roles.COACH,
  };

  const CoachingSessionServiceMock = {
    getCoachSessionTokens: jest
      .fn()
      .mockResolvedValue(coachingSessionAccessMock),
    getCoacheeSessionTokens: jest
      .fn()
      .mockResolvedValue(coachingSessionAccessMock),
    finishSession: jest.fn().mockResolvedValue(coachingSessionMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingSessionResolver,
        {
          provide: CoachingSessionService,
          useValue: CoachingSessionServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<CoachingSessionResolver>(CoachingSessionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getCoachSessionTokens', () => {
    it('should call getCoachSessionTokens', async () => {
      const result = await resolver.getCoachSessionTokens(
        sessionMock,
        sessionIdMock,
      );
      expect(
        CoachingSessionServiceMock.getCoachSessionTokens,
      ).toHaveBeenCalled();
      expect(result).toEqual(coachingSessionAccessMock);
    });
  });

  describe('getCoacheeSessionTokens', () => {
    it('should call getCoacheeSessionTokens', async () => {
      const result = await resolver.getCoacheeSessionTokens(
        { ...sessionMock, role: Roles.COACHEE },
        sessionIdMock,
      );
      expect(
        CoachingSessionServiceMock.getCoacheeSessionTokens,
      ).toHaveBeenCalled();
      expect(result).toEqual(coachingSessionAccessMock);
    });
  });

  describe('finishSession', () => {
    it('should call finishSession', async () => {
      const result = await resolver.finishSession(sessionMock, sessionIdMock);
      expect(CoachingSessionServiceMock.finishSession).toHaveBeenCalled();
      expect(result).toEqual(coachingSessionMock);
    });
  });
});
