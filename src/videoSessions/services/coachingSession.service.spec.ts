import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { AgoraService } from 'src/agora/services/agora.service';
import { CoachingSessionRepository } from 'src/videoSessions/repositories/coachingSession.repository';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { CoachingSessionAccess } from 'src/videoSessions/models/coachingSessionAccess.model';
import { Roles } from 'src/users/enums/roles.enum';
import dayjs from 'dayjs';
import { MindfitException } from 'src/common/exceptions/mindfitException';

describe('CoachingSessionService', () => {
  let service: CoachingSessionService;

  const now = new Date();
  const coacheeMock = { id: 1 } as Coachee;
  const coachingSessionMock = {
    id: 1,
    coach: { id: 1 } as Coach,
    coachee: { id: 1 } as Coachee,
    appointmentRelated: { id: 1, startDate: now } as CoachAppointment,
    coachingSessionFeedback: { id: 1 } as CoachingSessionFeedback,
    remarks: 'TEST_REMARKS',
    coachFeedback: 'TEST_COACH_FEEDBACK',
    coachEvaluation: 'TEST_COACH_EVALUATION',
    coacheeFeedback: 'TEST_COACHEE_FEEDBACK',
    isCoachInSession: true,
    isCoacheeInSession: false,
  } as CoachingSession;

  const coachingSessionsArrayMock = [{ ...coachingSessionMock }];

  const coachingSessionTimelineMock = {
    labels: ['TEST_LABEL'],
    datasets: [
      {
        label: 'TEST_LABEL',
        data: [1, 2],
      },
    ],
  };

  const data = {
    coachId: coachingSessionMock.coach.id,
    coacheeId: coachingSessionMock.coachee.id,
    remarks: coachingSessionMock.remarks,
    coachFeedback: coachingSessionMock.coachFeedback,
    coachEvaluation: coachingSessionMock.coachEvaluation,
    coacheeFeedback: coachingSessionMock.coacheeFeedback,
  };

  const agoraTokensMock = {
    rtcToken: 'TEST_RTC_TOKEN',
    rtmToken: 'TEST_RTM_TOKEN',
  };

  const coachingSessionAccessMock = {
    coachingSession: coachingSessionMock,
    videoSessionChannel: `session-${data.coachId}-${data.coacheeId}`,
    chatSessionChannel: `chat-${data.coachId}-${data.coacheeId}`,
    tokens: agoraTokensMock,
  } as CoachingSessionAccess;

  const sessionIdMock = coachingSessionMock.id;
  const sessionMock = {
    userId: 1,
    email: 'test@email.com',
    role: Roles.COACHEE,
  };
  const coachAppointmentMock = {
    id: 1,
    //coachAgenda: coachAgendaMock,
    coachee: coacheeMock,
    coachingSession: null,
    startDate: now,
    endDate: now,
    remarks: 'DEFAULT_REAMRKS',
    coacheeConfirmation: null,
    coachConfirmation: null,
    accomplished: false,
  } as CoachAppointment;

  const CoachingSessionRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    getCoacheesAllCompletedCoachingSessions: jest
      .fn()
      .mockResolvedValue(coachingSessionsArrayMock),
  };

  const AgoraServiceMock = {
    getAgoraRtcToken: jest.fn().mockReturnValue(agoraTokensMock.rtcToken),
    getAgoraRtmToken: jest.fn().mockReturnValue(agoraTokensMock.rtmToken),
  };

  const CoachAppointmentServiceMock = {
    update: jest
      .fn()
      .mockResolvedValue({ ...coachAppointmentMock, accomplished: true }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingSessionService,
        {
          provide: CoachingSessionRepository,
          useValue: CoachingSessionRepositoryMock,
        },
        {
          provide: AgoraService,
          useValue: AgoraServiceMock,
        },
        {
          provide: CoachAppointmentService,
          useValue: CoachAppointmentServiceMock,
        },
      ],
    }).compile();

    service = module.get<CoachingSessionService>(CoachingSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoacheeSessionTokens', () => {
    const updatedCoachSessionMock = {
      ...coachingSessionMock,
      isCoacheeInSession: true,
    };
    it('should return the correct tokens', async () => {
      CoachingSessionRepositoryMock.findOneBy.mockResolvedValue(
        coachingSessionMock,
      );
      CoachingSessionRepositoryMock.update.mockResolvedValue(
        updatedCoachSessionMock,
      );
      jest
        .spyOn(service, 'getCoacheeSessionTokens')
        .mockImplementation()
        .mockResolvedValue(coachingSessionAccessMock);

      await expect(
        Promise.resolve(
          service.getCoacheeSessionTokens(sessionIdMock, sessionMock.userId),
        ),
      ).resolves.toEqual(coachingSessionAccessMock);
    });

    it('should throw MindfitException exception when validation is not passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        isCoachInSession: false,
      };
      CoachingSessionRepositoryMock.findOneBy.mockResolvedValue(
        coachingSession,
      );
      jest
        .spyOn(
          dayjs(coachingSessionMock.appointmentRelated.startDate),
          'isBefore',
        )
        .mockReturnValue(true);

      try {
        await service.getCoacheeSessionTokens(
          sessionIdMock,
          sessionMock.userId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Session is not started yet');
        expect(error.response.errorCode).toBe('SESSION_NO_STARTED');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('getCoacheesCoachingSessionExecutionTimelineDataset', () => {
    it('should return the correct dataset', async () => {
      CoachingSessionRepositoryMock.getCoacheesAllCompletedCoachingSessions();
      jest
        .spyOn(service, 'getCoacheesCoachingSessionExecutionTimelineDataset')
        .mockImplementation()
        .mockResolvedValue(coachingSessionTimelineMock);

      await expect(
        Promise.resolve(
          service.getCoacheesCoachingSessionExecutionTimelineDataset([
            coacheeMock.id,
          ]),
        ),
      ).resolves.toEqual(coachingSessionTimelineMock);
    });
  });

  describe('finishSession', () => {
    it('should update a coachAppointment and return a coachingSession when validation is passed', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(coachingSessionMock);
      CoachAppointmentServiceMock.update();
      jest
        .spyOn(service, 'finishSession')
        .mockImplementation()
        .mockResolvedValue(coachingSessionMock);

      await expect(
        Promise.resolve(service.finishSession(sessionIdMock)),
      ).resolves.toEqual(coachingSessionMock);
    });

    it('should throw MindfitException exception when validation is not passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        isCoachInSession: false,
      };
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(coachingSession);

      jest
        .spyOn(
          dayjs(coachingSessionMock.appointmentRelated.startDate),
          'isBefore',
        )
        .mockReturnValue(true);

      try {
        await service.finishSession(sessionIdMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Session is not started yet');
        expect(error.response.errorCode).toBe('SESSION_NO_STARTED');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('createCoachingSession', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.create.mockResolvedValue(
        coachingSessionMock,
      );
    });

    it('Should create a CoachingSession', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coachingSessionMock);
      expect(CoachingSessionRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoachingSessions', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.update.mockReturnValue(coachingSessionMock);
      CoachingSessionRepositoryMock.updateMany.mockReturnValue([
        coachingSessionMock,
      ]);
    });

    it('Should edit a CoachingSession', async () => {
      const result = await service.update(coachingSessionMock.id, data);

      expect(result).toEqual(coachingSessionMock);
      expect(CoachingSessionRepositoryMock.update).toHaveBeenCalledWith(
        coachingSessionMock.id,
        data,
      );
    });

    it('Should edit multiple CoachingSessions', async () => {
      const result = await service.updateMany([coachingSessionMock.id], data);

      expect(result).toEqual([coachingSessionMock]);
      expect(CoachingSessionRepositoryMock.updateMany).toHaveBeenCalledWith(
        [coachingSessionMock.id],
        data,
      );
    });
  });

  describe('getCoachingSessions', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.findAll.mockResolvedValue([
        coachingSessionMock,
      ]);
    });

    it('Should return multiple CoachingSessions', async () => {
      const result = await service.findAll(undefined);

      expect(result).toEqual([coachingSessionMock]);
      expect(CoachingSessionRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getCoachingSession', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.findOneBy.mockResolvedValue(
        coachingSessionMock,
      );
    });

    it('Should return a CoachingSession', async () => {
      const result = await service.findOne(coachingSessionMock.id);

      expect(result).toEqual(coachingSessionMock);
      expect(CoachingSessionRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: coachingSessionMock.id,
      });
    });
  });

  describe('deleteCoachingSessions', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.delete.mockReturnValue(1);
    });

    it('Should delete a specific CoachingSession', async () => {
      const result = await service.delete(coachingSessionMock.id);

      expect(result).toEqual(1);
      expect(CoachingSessionRepositoryMock.delete).toHaveBeenCalledWith(
        coachingSessionMock.id,
      );
    });

    it('Should delete multiple CoachingSessions', async () => {
      const result = await service.delete([coachingSessionMock.id]);

      expect(result).toEqual(1);
      expect(CoachingSessionRepositoryMock.delete).toHaveBeenCalledWith([
        coachingSessionMock.id,
      ]);
    });
  });
});
