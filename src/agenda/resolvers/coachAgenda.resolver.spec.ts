import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaResolver } from 'src/agenda/resolvers/coachAgenda.resolver';
import { UsersService } from 'src/users/services/users.service';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachService } from 'src/coaching/services/coach.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Roles } from 'src/users/enums/roles.enum';
import { Coach } from 'src/coaching/models/coach.model';
import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { AgendaErrorsEnum } from '../enums/agendaErrors.enum';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { Coachee } from 'src/coaching/models/coachee.model';

describe('CoachAgendaResolver', () => {
  let resolver: CoachAgendaResolver;
  const now = new Date();
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
      coachAgenda: coachAgendaMock,
    },
  } as Coachee;

  const dayAvailabilityObjectTypeMock = {
    date: now,
    availability: [
      {
        from: now,
        to: now,
      },
    ],
  };

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    password: 'TEST_PASSWORD',
    languages: 'TEST_LANGUAGE',
    coach: {
      id: 1,
    } as Coach,
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: true,
    role: Roles.COACH,
  };

  const sessionMock = {
    userId: userMock.id,
    email: userMock.email,
    role: Roles.COACH,
  };
  const editCoachAgendaDtoMock = {
    outOfService: true,
  };

  const CoachAgendaServiceMock = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    getAvailabilityByMonths: jest.fn(),
    createCoachAgenda: jest.fn(),
  };
  const UsersServiceMock = {
    findOne: jest.fn(),
  };
  const CoachServiceMock = {};
  const CoacheeServiceMock = {
    validateActiveCoacheeProfile: jest.fn(),
    validateCoacheeHaveSelectedCoach: jest.fn(),
  };

  const createCoachAgendaDtoMock = {
    coachId: coacheeMock.id,
    availabilityRange: null,
    outOfService: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAgendaResolver,
        {
          provide: CoachAgendaService,
          useValue: CoachAgendaServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoachService,
          useValue: CoachServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<CoachAgendaResolver>(CoachAgendaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('updateCoachAgenda', () => {
    const updatedCoachAgenda = { ...coachAgendaMock, outOfService: true };
    it('should return the updated coachAgenda when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachAgendaServiceMock.findOneBy.mockResolvedValue(coachAgendaMock);
      CoachAgendaServiceMock.update.mockResolvedValue(updatedCoachAgenda);
      const result = await resolver.update(sessionMock, editCoachAgendaDtoMock);
      expect(result).toBeDefined();
      expect(result).toEqual(updatedCoachAgenda);
    });

    it('should throw an error when first validation is not passed', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await resolver.update(sessionMock, editCoachAgendaDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('You do not have a Coach profile');
        expect(error.response.errorCode).toEqual(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw an error when second validation is not passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachAgendaServiceMock.findOneBy.mockResolvedValue(null);
      try {
        await resolver.update(sessionMock, editCoachAgendaDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('The Coach has no Agenda');
        expect(error.response.errorCode).toEqual('500');
        expect(error.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getCoachAvailability', () => {
    it('should return the coach availability when validation is passed', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockResolvedValue(
        coacheeMock,
      );
      CoachAgendaServiceMock.getAvailabilityByMonths.mockResolvedValue(
        dayAvailabilityObjectTypeMock,
      );
      const result = await resolver.getCoachAvailability(sessionMock, now, now);
      expect(result).toBeDefined();
      expect(result).toEqual(dayAvailabilityObjectTypeMock);
    });

    it('should throw minfit exception when validation is not passed', async () => {
      const coachee = {
        ...coacheeMock,
        assignedCoach: {
          coachAgenda: { ...coachAgendaMock, outOfService: true },
        },
      };

      CoacheeServiceMock.validateActiveCoacheeProfile.mockResolvedValue(
        coachee,
      );

      try {
        await resolver.getCoachAvailability(sessionMock, now, now);
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

  describe('getCoachAvailabilityByAgendaId', () => {
    it('should return the coach availability when validation is passed', async () => {
      CoachAgendaServiceMock.findOne.mockResolvedValue(coachAgendaMock);

      CoachAgendaServiceMock.getAvailabilityByMonths.mockResolvedValue(
        dayAvailabilityObjectTypeMock,
      );

      const result = await resolver.getCoachAvailabilityByAgendaId(
        coachAgendaMock.id,
        now,
        now,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(dayAvailabilityObjectTypeMock);
    });
    it('should throw minfit exception when validation is not passed', async () => {
      const coachAgenda = { ...coachAgendaMock, outOfService: true };
      CoachAgendaServiceMock.findOne.mockResolvedValue(coachAgenda);

      try {
        await resolver.getCoachAvailabilityByAgendaId(
          coachAgendaMock.id,
          now,
          now,
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

  describe('createCoachAgenda', () => {
    beforeAll(() => {
      CoachAgendaServiceMock.createCoachAgenda.mockResolvedValue(
        coachAgendaMock,
      );
    });

    it('should return the created coachAgenda', async () => {
      const result = await resolver.create(createCoachAgendaDtoMock);
      expect(result).toBeDefined();
      expect(result).toEqual(coachAgendaMock);
    });
  });
});
