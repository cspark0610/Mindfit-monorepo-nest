import { Test, TestingModule } from '@nestjs/testing';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { UsersService } from 'src/users/services/users.service';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { User } from 'src/users/models/users.model';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { HttpStatus } from '@nestjs/common';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { Roles } from 'src/users/enums/roles.enum';

describe('CoachAppointmentService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let service: CoachAppointmentService;

  const now = new Date();
  const coachMock = {
    id: 1,
    user: {
      id: 1,
    },
    coachApplication: {
      id: 1,
    },
    coachingAreas: [],
    bio: 'TEST_BIO',
    phoneNumber: 'TEST_PHONE_NUMBER',
    isActive: true,
  } as Coach;

  const coacheeMock = {
    id: 2,
    user: {
      id: 2,
    },
    organization: { id: 1 },
    coachingAreas: [],
    coachAppointments: [],
    coachNotes: [],
    coachingSessions: [],
    coacheeEvaluations: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    position: 'TEST_POSITION',
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
    invited: true,
    invitationAccepted: false,
    assignedCoach: {
      id: 1,
    },
  } as Coachee;

  const coachAgendaMock = {
    id: 1,
    coach: {
      id: 1,
    },
    coachAgendaDays: [],
    coachAppointments: [],
    availabilityRange: {
      monday: [
        {
          from: '08:00',
          to: '13:00',
        },
      ],
    },
    outOfService: false,
  };

  const coachAppointmentMock = {
    id: 1,
    coachAgenda: coachAgendaMock,
    coachee: coacheeMock,
    coachingSession: null,
    startDate: now,
    endDate: now,
    remarks: 'DEFAULT_REAMRKS',
    coacheeConfirmation: null,
    coachConfirmation: null,
    accomplished: false,
  } as CoachAppointment;

  const coachAppointmentArrayMock = [{ ...coachAppointmentMock }];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...coachAppointmentDtoMock } = coachAppointmentMock;

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    coachee: coacheeMock,
    coach: {
      id: 1,
      coachAgenda: { id: 1 },
    },
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
    role: Roles.COACH,
  } as unknown as User;

  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACH,
  };

  const coachingSessionMock = {
    id: 1,
    coach: coachMock,
    coachee: coacheeMock,
    appointmentRelated: coachAppointmentMock,
    coachingSessionFeedback: null,
    remarks: 'TEST_REMARKS',
    coachEvaluation: null,
    coacheeFeedback: null,
    isCoachInSession: true,
    isCoacheeInSession: true,
  } as CoachingSession;

  const requestCoachAppointmentDtoMock = {
    startDate: now,
    endDate: now,
    remarks: 'TEST_REMARKS',
  };

  const CoachAppointmentRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    getCoachAppointmetsByDateRange: jest.fn(),
    getCoacheeAppointmentsByDateRange: jest.fn(),
  };

  const CoachingSessionServiceMock = {
    create: jest.fn(),
  };

  const CoachAppointmentValidatorMock = {
    validateRequestAppointmentDate: jest.fn(),
    validateCoachAvailabilityByDateRange: jest.fn(),
    validateMaxCoacheeAppointments: jest.fn(),
  };

  const CoacheeServiceMock = {
    findOne: jest.fn(),
  };

  const CoachAgendaServiceMock = {
    findOneBy: jest.fn(),
  };

  const UsersServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAppointmentService,
        {
          provide: CoachAppointmentRepository,
          useValue: CoachAppointmentRepositoryMock,
        },
        {
          provide: CoachingSessionService,
          useValue: CoachingSessionServiceMock,
        },
        {
          provide: CoachAppointmentValidator,
          useValue: CoachAppointmentValidatorMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
        {
          provide: CoachAgendaService,
          useValue: CoachAgendaServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();

    service = module.get<CoachAppointmentService>(CoachAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAppointment', () => {
    it('should call CoachAppointmentRepository.create and CoachingSessionsService.create when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);

      CoachAppointmentValidatorMock.validateRequestAppointmentDate.mockResolvedValue(
        true,
      );
      CoachAppointmentValidatorMock.validateRequestAppointmentDate.mockResolvedValue(
        true,
      );

      CoachAppointmentRepositoryMock.create.mockResolvedValue(
        coachAppointmentMock,
      );
      CoachingSessionServiceMock.create.mockResolvedValue(coachingSessionMock);

      const result = await service.createAppointment(
        sessionMock.userId,
        coachAppointmentDtoMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentMock);
    });

    it('should throw an error when the user logged has no coach profile', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.createAppointment(
          sessionMock.userId,
          coachAppointmentDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('You do not have a Coach profile');
        expect(error.response.errorCode).toEqual(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw an error when the user logged does not passes second validation', async () => {
      const user = { ...userMock, coach: { id: 1 } };
      const coachee = { ...coacheeMock, assignedCoach: { id: 8 } };

      UsersServiceMock.findOne.mockResolvedValue(user);
      CoacheeServiceMock.findOne.mockResolvedValue(coachee);

      try {
        await service.createAppointment(
          sessionMock.userId,
          coachAppointmentDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'The coachee is not assigned to you.',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.COACHEE_NOT_ASSIGNED_TO_COACH,
        );
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('requestAppointment', () => {
    it('should return a coachAppoinment when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachAgendaServiceMock.findOneBy.mockResolvedValue(coachAgendaMock);

      CoachAppointmentValidatorMock.validateRequestAppointmentDate.mockResolvedValue(
        true,
      );
      CoachAppointmentValidatorMock.validateMaxCoacheeAppointments.mockResolvedValue(
        true,
      );
      CoachAppointmentValidatorMock.validateCoachAvailabilityByDateRange.mockResolvedValue(
        true,
      );
      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentMock);

      CoachingSessionServiceMock.create.mockResolvedValue(coachingSessionMock);

      const result = await service.requestAppointment(
        sessionMock.userId,
        requestCoachAppointmentDtoMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentMock);
    });

    it('should throw mindfit exception when first validation is not passed', async () => {
      const user = { ...userMock, coachee: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.requestAppointment(
          sessionMock.userId,
          requestCoachAppointmentDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'You do not have a Coachee profile',
        );
        expect(error.response.errorCode).toEqual(
          CoacheeErrors.NO_COACHEE_PROFILE,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw mindfit exception when second validation is not passed', async () => {
      const user = { ...userMock, coachee: { id: 1, assignedCoach: null } };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.requestAppointment(
          sessionMock.userId,
          requestCoachAppointmentDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'Coachee does not have an assigned coach',
        );
        expect(error.response.errorCode).toEqual(CoachErrors.NO_COACH_ASSIGNED);
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw mindfit exception when third validation is not passed', async () => {
      const coachAgenda = { ...coachAgendaMock, outOfService: true };
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachAgendaServiceMock.findOneBy.mockResolvedValue(coachAgenda);

      try {
        await service.requestAppointment(
          sessionMock.userId,
          requestCoachAppointmentDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'Coach temporarily out of service',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.COACH_TEMPORARILY_OUT_OF_SERVICE,
        );
        expect(error.status).toEqual(HttpStatus.NO_CONTENT);
      }
    });
  });

  describe('getCoachAppointmetsByDateRange', () => {
    it('should return a list of coachAppointments', async () => {
      CoachAppointmentRepositoryMock.getCoachAppointmetsByDateRange.mockResolvedValue(
        coachAppointmentArrayMock,
      );
      const result = await service.getCoachAppointmetsByDateRange(
        coachAgendaMock.id,
        now,
        now,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentArrayMock);
    });
  });

  describe('getCoacheeAppointmentsByDateRange', () => {
    it('should return a list of coachAppointments', async () => {
      CoachAppointmentRepositoryMock.getCoacheeAppointmentsByDateRange.mockResolvedValue(
        coachAppointmentArrayMock,
      );
      const result = await service.getCoacheeAppointmentsByDateRange(
        coachAgendaMock.id,
        now,
        now,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentArrayMock);
    });
  });

  describe('postponeAppointment', () => {
    it('should return a coachAppointment updated when all validations are passed', async () => {
      CoachAppointmentValidatorMock.validateRequestAppointmentDate.mockResolvedValue(
        true,
      );
      CoachAppointmentValidatorMock.validateCoachAvailabilityByDateRange.mockResolvedValue(
        true,
      );
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentMock);

      const result = await service.postponeAppointment(
        coachAppointmentMock,
        now,
        now,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentMock);
    });

    it('should throw mindfit exception when first validation is not passed', async () => {
      const coachAppointment = { ...coachAppointmentMock, accomplished: true };
      try {
        await service.postponeAppointment(coachAppointment, now, now);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'The Appointment is already accomplished.',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.APPOINTMENT_ACCOMPLISHED,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('coachPostponeAppointment', () => {
    it('should return a coachAppointment updated when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentMock);

      jest
        .spyOn(service, 'postponeAppointment')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentMock);

      const result = await service.coachPostponeAppointment(
        sessionMock.userId,
        coachAppointmentMock.id,
        now,
        now,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentMock);
    });

    it('should throw mindfit exception when first validation is not passed', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.coachPostponeAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
          now,
          now,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('You do not have a Coach profile');
        expect(error.response.errorCode).toEqual(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw mindfit exception when second validation is not passed', async () => {
      const user = { ...userMock, coach: { id: 11 } };
      const appointment = {
        ...coachAppointmentMock,
        coachAgenda: { coach: { id: 3 } },
      };
      UsersServiceMock.findOne.mockResolvedValue(user);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(appointment as any);

      try {
        await service.coachPostponeAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
          now,
          now,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'The Appointment does not belong to you.',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
        );
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('coacheePostponeAppointment', () => {
    it('should return a coachAppointment updated when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentMock);

      jest
        .spyOn(service, 'postponeAppointment')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentMock);

      const result = await service.coacheePostponeAppointment(
        sessionMock.userId,
        coachAppointmentMock.id,
        now,
        now,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentMock);
    });

    it('should throw mindfit exception when first validation is not passed', async () => {
      const user = { ...userMock, coachee: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.coacheePostponeAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
          now,
          now,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'You do not have a Coachee profile',
        );
        expect(error.response.errorCode).toEqual(
          CoacheeErrors.NO_COACHEE_PROFILE,
        );
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw mindfit exception when second validation is not passed', async () => {
      const user = { ...userMock, coachee: { id: 11 } };
      const appointment = {
        ...coachAppointmentMock,
        coachee: { id: 3 },
      };
      UsersServiceMock.findOne.mockResolvedValue(user);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(appointment as any);

      try {
        await service.coacheePostponeAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
          now,
          now,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'The Appointment does not belong to you.',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
        );
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('coachConfirmAppointment', () => {
    it('should return a coachAppointment updated when all validations are passed', async () => {
      const coachAppointmentConfirmedMock = {
        ...coachAppointmentMock,
        coachConfirmation: now,
      };
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentMock);

      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentConfirmedMock);

      const result = await service.coachConfirmAppointment(
        sessionMock.userId,
        coachAppointmentMock.id,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAppointmentConfirmedMock);
    });

    it('should throw mindfit exception when first validation is not passed', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.coachConfirmAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('You do not have a Coach profile');
        expect(error.response.errorCode).toEqual(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw mindfit exception when second validation is not passed', async () => {
      const user = { ...userMock, coach: { id: 11 } };
      const appointment = {
        ...coachAppointmentMock,
        coachAgenda: { coach: { id: 3 } },
      };
      UsersServiceMock.findOne.mockResolvedValue(user);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(appointment as any);

      try {
        await service.coachConfirmAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'The Appointment is not related to your Coach Agenda',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.APPOINTMENT_NOT_RELATED_TO_AGENDA,
        );
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw mindfit exception when third validation is not passed', async () => {
      const appointment = { ...coachAppointmentMock, accomplished: true };

      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(appointment as any);

      try {
        await service.coachConfirmAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'The Appointment is already accomplished',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.APPOINTMENT_ACCOMPLISHED,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
    it('should throw mindfit exception when fourth validation is not passed', async () => {
      const appointment = {
        ...coachAppointmentMock,
        coachConfirmation: '2022-2-22',
      };

      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(appointment as any);

      try {
        await service.coachConfirmAppointment(
          sessionMock.userId,
          coachAppointmentMock.id,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'The Appointment is already confirmed',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.APPOINTMENT_ACCOMPLISHED,
        );
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });
});
