import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeAgendaResolver } from 'src/agenda/resolvers/coacheeAgenda.resolver';
import { UsersService } from 'src/users/services/users.service';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoacheeAgenda } from 'src/agenda/models/coacheeAgenda.model';
import { CoacheeAgendaService } from 'src/agenda/services/coacheeAgenda.service';
import { Coach } from 'src/coaching/models/coach.model';
import { User } from 'src/users/models/users.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { Roles } from 'src/users/enums/roles.enum';
import { HttpStatus } from '@nestjs/common';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { MindfitException } from 'src/common/exceptions/mindfitException';

describe('CoacheeAgendaResolver', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let resolver: CoacheeAgendaResolver;
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

  const coachAppointmentMock = {
    id: 1,
    coachingSession: null,
    startDate: now,
    endDate: now,
    remarks: 'DEFAULT_REAMRKS',
    coacheeConfirmation: null,
    coachConfirmation: null,
    accomplished: false,
  } as CoachAppointment;

  const coachAppointmentArrayMock = [{ ...coachAppointmentMock }];

  const coacheeAgendaMock: CoacheeAgenda = {
    assignedCoach: coachMock,
    appointments: coachAppointmentArrayMock,
    satsRealized: [],
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
    },
  } as Coachee;

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
    role: Roles.COACHEE,
  } as User;

  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACHEE,
  };

  const CoacheeAgendaServiceMock = {
    getCoacheeAgendaByDateRange: jest.fn(),
  };
  const UsersServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeAgendaResolver,
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoacheeAgendaService,
          useValue: CoacheeAgendaServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<CoacheeAgendaResolver>(CoacheeAgendaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getCoacheeAgenda', () => {
    it('should call getCoacheeAgendaByDateRange', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoacheeAgendaServiceMock.getCoacheeAgendaByDateRange.mockResolvedValue(
        coacheeAgendaMock,
      );
      const res = await resolver.getCoacheeAgenda(sessionMock, now, now);
      expect(res).toBeDefined();
      expect(res).toEqual(coacheeAgendaMock);
    });

    it('should throw mindfit exception when validation is not passed', async () => {
      const user = { ...userMock, coachee: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await resolver.getCoacheeAgenda(sessionMock, now, now);
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
  });
});
