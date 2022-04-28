import { Test, TestingModule } from '@nestjs/testing';
import { CoachingSessionFeedbackService } from 'src/videoSessions/services/coachingSessionFeedback.service';
import { CoachingSessionFeedbackRepository } from 'src/videoSessions/repositories/coachingSessionFeedback.repository';
import { UsersService } from 'src/users/services/users.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { FeedbackService } from 'src/videoSessions/services/feedback.service';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { Feedback } from 'src/videoSessions/models/feedback.model';
import { Roles } from 'src/users/enums/roles.enum';
import {
  CoacheeSessionFeedbackDto,
  CoachSessionFeedbackDto,
} from 'src/videoSessions/dto/coachingSessionFeedback.dto';
import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { CoachingSessionFeedbackErrors } from 'src/videoSessions/enums/coachingSessionFeedbackErrors.enum';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';

describe('CoachingSessionFeedbackService', () => {
  let service: CoachingSessionFeedbackService;
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
  const coachingSessionFeedbackMock = {
    id: 1,
    coachingSession: coachingSessionMock,
    feedback: feedbackMock,
    coacheeFeedback: [],
    coachFeedback: [],
  } as CoachingSessionFeedback;
  const coachingSessionFeedbackArrayMock = [{ ...coachingSessionFeedbackMock }];
  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    password: 'TEST_PASSWORD',
    languages: 'TEST_LANGUAGE',
    coach: { id: 1 } as Coach,
    coachee: { id: 1 } as Coachee,
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
    role: Roles.COACHEE,
  };
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
  const CoacheesSatisfactionMock = {
    averageSatisfaction: 1,
    sessionsSatisfaction: [],
  };
  const CoachingSessionFeedbackRepositoryMock = {
    getCoachingSessionFeedbackByCoacheesIds: jest
      .fn()
      .mockResolvedValue(coachingSessionFeedbackArrayMock),
  };
  const UsersServiceMock = {
    findOne: jest.fn().mockResolvedValue(userMock),
  };
  const CoachingSessionServiceMock = {
    findOne: jest.fn().mockResolvedValue(coachingSessionMock),
  };
  const FeedbackServiceMock = {
    findOne: jest.fn().mockResolvedValue(feedbackMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingSessionFeedbackService,
        {
          provide: CoachingSessionFeedbackRepository,
          useValue: CoachingSessionFeedbackRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoachingSessionService,
          useValue: CoachingSessionServiceMock,
        },
        {
          provide: FeedbackService,
          useValue: FeedbackServiceMock,
        },
      ],
    }).compile();
    service = module.get<CoachingSessionFeedbackService>(
      CoachingSessionFeedbackService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('coacheeCoachingSessionFeedback', () => {
    it('should return an updated CoachingSessionFeedback when all validations are passed', async () => {
      const updatedCoachingSessionFeedback = {
        ...coachingSessionFeedbackMock,
        coacheeFeedback: CoacheeSessionFeedbackDtoMock.coacheeFeedback,
      } as CoachingSessionFeedback;

      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne();
      FeedbackServiceMock.findOne();
      jest.spyOn(service, 'validateFeedback').mockImplementation();
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(updatedCoachingSessionFeedback);

      const result = await service.coacheeCoachingSessionFeedback(
        userMock.id,
        CoacheeSessionFeedbackDtoMock,
      );
      expect(result).toEqual(updatedCoachingSessionFeedback);
      // await expect(
      //   Promise.resolve(
      //     service.coacheeCoachingSessionFeedback(
      //       userMock.id,
      //       CoacheeSessionFeedbackDtoMock,
      //     ),
      //   ),
      // ).resolves.toEqual(updatedCoachingSessionFeedback);
    });

    it('should return an created CoachingSessionFeedback when all validations are passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        coachingSessionFeedback: null,
      };

      const createdCoachingSessionFeedback = {
        ...coachingSessionFeedbackMock,
        coacheeFeedback: CoacheeSessionFeedbackDtoMock.coacheeFeedback,
      } as CoachingSessionFeedback;

      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);
      FeedbackServiceMock.findOne();

      jest.spyOn(service, 'validateFeedback').mockImplementation();
      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(createdCoachingSessionFeedback);

      const result = await service.coacheeCoachingSessionFeedback(
        userMock.id,
        CoacheeSessionFeedbackDtoMock,
      );
      expect(result).toEqual(createdCoachingSessionFeedback);
    });
    it('should throw exception when 1st validation is not passed', async () => {
      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(null);
      try {
        await service.coacheeCoachingSessionFeedback(
          userMock.id,
          CoacheeSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Coaching Session does not exists');
        expect(error.response.errorCode).toBe(
          'Coaching Session does not exists',
        );
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw exception when 2nd validation is not passed', async () => {
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSessionMock);
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        coachee: null,
      });
      try {
        await service.coacheeCoachingSessionFeedback(
          userMock.id,
          CoacheeSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('You do not have a Coachee profile');
        expect(error.response.errorCode).toBe(CoacheeErrors.NO_COACHEE_PROFILE);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw exception when 3th validation is not passed', async () => {
      const coachingSession = { ...coachingSessionMock, coachee: { id: 22 } };

      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);
      FeedbackServiceMock.findOne.mockResolvedValue(feedbackMock);
      try {
        await service.coacheeCoachingSessionFeedback(
          userMock.id,
          CoacheeSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Coachee not in Coaching Session.');
        expect(error.response.errorCode).toBe(
          CoacheeErrors.COACHEE_NOT_IN_COACHING_SESSION,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw exception when 4th validation is not passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        appointmentRelated: {
          accomplished: false,
        },
      };
      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);

      try {
        await service.coacheeCoachingSessionFeedback(
          userMock.id,
          CoacheeSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'You cannot rate an unexecuted session.',
        );
        expect(error.response.errorCode).toBe(
          CoachingSessionFeedbackErrors.UNEXECUTED_COACHING_SESSION,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw exception when 5th validation is not passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        coachingSessionFeedback: {
          coacheeFeedback: defaultFeedbackAnswerMock,
        },
      };

      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);
      FeedbackServiceMock.findOne();
      try {
        await service.coacheeCoachingSessionFeedback(
          userMock.id,
          CoacheeSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Session Already Rated.');
        expect(error.response.extra).toBe(
          coachingSession.coachingSessionFeedback,
        );
        expect(error.response.errorCode).toBe(
          CoachingSessionFeedbackErrors.SESSION_ALREADY_RATED,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw exception when 6th validation is not passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSessionMock);
      FeedbackServiceMock.findOne.mockResolvedValue(feedbackMock);
      jest.spyOn(service, 'validateFeedback').mockImplementation(() => {
        throw new MindfitException({
          error: 'All questions must be answered.',
          errorCode:
            CoachingSessionFeedbackErrors.NOT_ALL_QUESTIONS_WERE_ANSWERED,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      try {
        await service.coacheeCoachingSessionFeedback(
          userMock.id,
          CoacheeSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('All questions must be answered.');
        expect(error.response.errorCode).toBe(
          CoachingSessionFeedbackErrors.NOT_ALL_QUESTIONS_WERE_ANSWERED,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('coachCoachingSessionFeedback', () => {
    it('should return an updated CoachingSessionFeedback when all validations are passed', async () => {
      const updatedCoachingSessionFeedback = {
        ...coachingSessionFeedbackMock,
        coachFeedback: CoachSessionFeedbackDtoMock.coachFeedback,
      } as CoachingSessionFeedback;

      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne();
      FeedbackServiceMock.findOne();
      jest.spyOn(service, 'validateFeedback').mockImplementation();
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(updatedCoachingSessionFeedback);

      const result = await service.coacheeCoachingSessionFeedback(
        userMock.id,
        CoachSessionFeedbackDtoMock as any,
      );
      expect(result).toEqual(updatedCoachingSessionFeedback);
    });
    it('should return an created CoachingSessionFeedback when all validations are passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        coachingSessionFeedback: null,
      };

      const createdCoachingSessionFeedback = {
        ...coachingSessionFeedbackMock,
        coachFeedback: CoachSessionFeedbackDtoMock.coachFeedback,
      } as CoachingSessionFeedback;

      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);
      FeedbackServiceMock.findOne();

      jest.spyOn(service, 'validateFeedback').mockImplementation();
      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(createdCoachingSessionFeedback);

      await expect(
        Promise.resolve(
          service.coacheeCoachingSessionFeedback(
            userMock.id,
            CoachSessionFeedbackDtoMock as any,
          ),
        ),
      ).resolves.toEqual(createdCoachingSessionFeedback);
    });
    it('should throw exception when 1st validation is not passed', async () => {
      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(null);
      try {
        await service.coachCoachingSessionFeedback(
          userMock.id,
          CoachSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Coaching Session does not exists');
        expect(error.response.errorCode).toBe(
          'Coaching Session does not exists',
        );
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
    it('should throw exception when 2nd validation is not passed', async () => {
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSessionMock);
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        coach: null,
      });
      try {
        await service.coachCoachingSessionFeedback(
          userMock.id,
          CoachSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('You do not have a Coach profile');
        expect(error.response.errorCode).toBe(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw exception when 3th validation is not passed', async () => {
      const coachingSession = { ...coachingSessionMock, coach: { id: 22 } };

      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);
      FeedbackServiceMock.findOne.mockResolvedValue(feedbackMock);
      try {
        await service.coachCoachingSessionFeedback(
          userMock.id,
          CoachSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Coach not in Coaching Session.');
        expect(error.response.errorCode).toBe(
          CoachErrors.COACH_NOT_IN_COACHING_SESSION,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
    it('should throw exception when 4th validation is not passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        appointmentRelated: {
          accomplished: false,
        },
      };
      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);

      try {
        await service.coachCoachingSessionFeedback(
          userMock.id,
          CoachSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'You cannot rate an unexecuted session.',
        );
        expect(error.response.errorCode).toBe(
          CoachingSessionFeedbackErrors.UNEXECUTED_COACHING_SESSION,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw exception when 5th validation is not passed', async () => {
      const coachingSession = {
        ...coachingSessionMock,
        coachingSessionFeedback: {
          coachFeedback: defaultFeedbackAnswerMock,
        },
      };
      UsersServiceMock.findOne();
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSession);
      FeedbackServiceMock.findOne();
      try {
        await service.coachCoachingSessionFeedback(
          userMock.id,
          CoachSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Session Already Rated.');
        expect(error.response.extra).toBe(
          coachingSession.coachingSessionFeedback,
        );
        expect(error.response.errorCode).toBe(
          CoachingSessionFeedbackErrors.SESSION_ALREADY_RATED,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw exception when 6th validation is not passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachingSessionServiceMock.findOne.mockResolvedValue(coachingSessionMock);
      FeedbackServiceMock.findOne.mockResolvedValue(feedbackMock);
      jest.spyOn(service, 'validateFeedback').mockImplementation(() => {
        throw new MindfitException({
          error: 'All questions must be answered.',
          errorCode:
            CoachingSessionFeedbackErrors.NOT_ALL_QUESTIONS_WERE_ANSWERED,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      try {
        await service.coachCoachingSessionFeedback(
          userMock.id,
          CoachSessionFeedbackDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('All questions must be answered.');
        expect(error.response.errorCode).toBe(
          CoachingSessionFeedbackErrors.NOT_ALL_QUESTIONS_WERE_ANSWERED,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('getCoachingSessionFeedbackByCoacheesIds', () => {
    it('should return an array of CoachingSessionFeedback', async () => {
      CoachingSessionFeedbackRepositoryMock.getCoachingSessionFeedbackByCoacheesIds();

      const result = await service.getCoachingSessionFeedbackByCoacheesIds([
        userMock.coachee.id,
      ]);
      expect(result).toEqual(coachingSessionFeedbackArrayMock);
    });
  });

  describe('getCoachingSessionFeedbackByCoachesIds', () => {
    it('should return a coacheeSatisfaction object', async () => {
      jest
        .spyOn(service, 'getCoacheesCoachingSessionSatisfaction')
        .mockImplementation()
        .mockResolvedValue(CoacheesSatisfactionMock);

      const result = await service.getCoacheesCoachingSessionSatisfaction(
        coachingSessionFeedbackArrayMock,
      );
      expect(result).toEqual(CoacheesSatisfactionMock);
    });
  });

  describe('getGlobalCoacheesSessionSatisfaction', () => {
    it('should return a coacheeSatisfaction object', async () => {
      jest
        .spyOn(service, 'findAll')
        .mockImplementation()
        .mockResolvedValue(coachingSessionFeedbackArrayMock);
      jest
        .spyOn(service, 'getCoacheesCoachingSessionSatisfaction')
        .mockImplementation()
        .mockResolvedValue(CoacheesSatisfactionMock);

      const result = await service.getGlobalCoacheesSessionSatisfaction();
      expect(result).toEqual(CoacheesSatisfactionMock);
    });
  });
});
