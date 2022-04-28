import { Test, TestingModule } from '@nestjs/testing';
import { CoachingSessionFeedbackResolver } from 'src/videoSessions/resolvers/coachingSessionFeedback.resolver';
import { CoachingSessionFeedbackService } from 'src/videoSessions/services/coachingSessionFeedback.service';
import { Roles } from 'src/users/enums/roles.enum';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import {
  CoacheeSessionFeedbackDto,
  CoachSessionFeedbackDto,
} from 'src/videoSessions/dto/coachingSessionFeedback.dto';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { Feedback } from 'src/videoSessions/models/feedback.model';

describe('CoachingSessionFeedbackResolver', () => {
  let resolver: CoachingSessionFeedbackResolver;
  const sessionMock = {
    userId: 1,
    email: 'test@email.com',
    role: Roles.COACHEE,
  };
  const now = new Date();
  const defaultFeedbackAnswerMock = {
    questionCodename: 'questionCodename?',
    value: 1,
  };
  const coachingSessionMock = {
    id: 1,
    coach: { id: 1 } as Coach,
    coachee: { id: 1 } as Coachee,
    appointmentRelated: {
      id: 1,
      startDate: now,
      accomplished: true,
    } as CoachAppointment,
    coachingSessionFeedback: {
      id: 1,
      coacheeFeedback: null,
    } as CoachingSessionFeedback,
    remarks: 'TEST_REMARKS',
    coachFeedback: 'TEST_COACH_FEEDBACK',
    coachEvaluation: 'TEST_COACH_EVALUATION',
    coacheeFeedback: 'TEST_COACHEE_FEEDBACK',
    isCoachInSession: true,
    isCoacheeInSession: false,
  } as CoachingSession;
  const feedbackMock = {
    id: 1,
    title: 'TEST_TITLE',
    description: 'TEST_DESCRIPTION',
    questions: [
      {
        defaultText: 'TEST_DEFAULT_TEXT',
        codename: 'TEST_CODENAME',
      },
    ],
    isActive: true,
    createdAt: now,
    updatedAt: now,
  } as Feedback;
  const CoacheeSessionFeedbackDtoMock = {
    coachingSessionId: coachingSessionMock.id,
    feedbackId: feedbackMock.id,
    coacheeFeedback: [defaultFeedbackAnswerMock],
  } as CoacheeSessionFeedbackDto;
  const CoachSessionFeedbackDtoMock = {
    coachingSessionId: coachingSessionMock.id,
    feedbackId: feedbackMock.id,
    coachFeedback: [defaultFeedbackAnswerMock],
  } as CoachSessionFeedbackDto;
  const coachingSessionFeedbackMock = {
    id: 1,
    coachingSession: coachingSessionMock,
    feedback: feedbackMock,
    coacheeFeedback: [],
    coachFeedback: [],
  } as CoachingSessionFeedback;
  const CoacheesSatisfactionMock = {
    averageSatisfaction: 1,
    sessionsSatisfaction: [],
  };

  const CoachingSessionFeedbackServiceMock = {
    coacheeCoachingSessionFeedback: jest
      .fn()
      .mockResolvedValue(coachingSessionFeedbackMock),
    coachCoachingSessionFeedback: jest
      .fn()
      .mockResolvedValue(coachingSessionFeedbackMock),
    getGlobalCoacheesSessionSatisfaction: jest
      .fn()
      .mockResolvedValue(CoacheesSatisfactionMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingSessionFeedbackResolver,
        {
          provide: CoachingSessionFeedbackService,
          useValue: CoachingSessionFeedbackServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<CoachingSessionFeedbackResolver>(
      CoachingSessionFeedbackResolver,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCoacheeCoachingSessionFeedback', () => {
    it('should call coacheeCoachingSessionFeedback method', async () => {
      const result = await resolver.createCoacheeCoachingSessionFeedback(
        sessionMock,
        CoacheeSessionFeedbackDtoMock,
      );
      expect(
        CoachingSessionFeedbackServiceMock.coacheeCoachingSessionFeedback,
      ).toHaveBeenCalled();
      expect(result).toEqual(coachingSessionFeedbackMock);
    });
  });

  describe('createCoachCoachingSessionFeedback', () => {
    it('should call createCoachCoachingSessionFeedback method', async () => {
      const result = await resolver.createCoachCoachingSessionFeedback(
        { ...sessionMock, role: Roles.COACH },
        CoachSessionFeedbackDtoMock,
      );
      expect(
        CoachingSessionFeedbackServiceMock.coachCoachingSessionFeedback,
      ).toHaveBeenCalled();
      expect(result).toEqual(coachingSessionFeedbackMock);
    });
  });

  describe('getGlobalCoacheeSessionSatisfaction', () => {
    it('should call getGlobalCoacheesSessionSatisfaction method', async () => {
      const result = await resolver.getGlobalCoacheeSessionSatisfaction();
      expect(
        CoachingSessionFeedbackServiceMock.getGlobalCoacheesSessionSatisfaction,
      ).toHaveBeenCalled();
      expect(result).toEqual(CoacheesSatisfactionMock);
    });
  });
});
