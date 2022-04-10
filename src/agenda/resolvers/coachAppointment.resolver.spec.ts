import { Test, TestingModule } from '@nestjs/testing';
import { CoachAppointmentsResolver } from 'src/agenda/resolvers/coachAppointment.resolver';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { UsersService } from 'src/users/services/users.service';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { Coach } from 'src/coaching/models/coach.model';
import { Roles } from 'src/users/enums/roles.enum';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import {
  CreateCoachAppointmentDto,
  RequestCoachAppointmentDto,
} from 'src/agenda/dto/coachAppointment.dto';

describe('CoachAppointmentsResolver', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let resolver: CoachAppointmentsResolver;

  const now = new Date();
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
    },
  } as Coachee;

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
  const { id, ...coachAppointmentDtoMock } = coachAppointmentMock;

  const requestCoachAppointmentDtoMock = {
    startDate: now,
    endDate: now,
    remarks: 'DEFAULT_REAMRKS',
  } as RequestCoachAppointmentDto;

  const CoachAppointmentsServiceMock = {
    createAppointment: jest.fn(),
    requestAppointment: jest.fn(),
    coachPostponeAppointment: jest.fn(),
    coachConfirmAppointment: jest.fn(),
  };
  const CoachAgendaServiceMock = {};
  const CoreConfigServiceMock = {};
  const CoachAppointmentValidatorMock = {};
  const CoacheeServiceMock = {};
  const UsersServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAppointmentsResolver,
        {
          provide: CoachAppointmentService,
          useValue: CoachAppointmentsServiceMock,
        },
        {
          provide: CoachAgendaService,
          useValue: CoachAgendaServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
        {
          provide: CoreConfigService,
          useValue: CoreConfigServiceMock,
        },
        {
          provide: CoachAppointmentValidator,
          useValue: CoachAppointmentValidatorMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<CoachAppointmentsResolver>(CoachAppointmentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  describe('createAppointment', () => {
    it('should call createAppointment method', async () => {
      jest
        .spyOn(CreateCoachAppointmentDto, 'from')
        .mockImplementation()
        .mockResolvedValue(coachAppointmentDtoMock);

      CoachAppointmentsServiceMock.createAppointment.mockResolvedValue(
        coachAppointmentMock,
      );
      const res = await resolver.create(
        sessionMock,
        coachAppointmentDtoMock as any,
      );
      expect(res).toBeDefined();
      expect(res).toEqual(coachAppointmentMock);
    });
  });

  describe('requestAppointment', () => {
    it('should call requestAppointment method', async () => {
      const sessionCoacheeMock = { ...sessionMock, role: Roles.COACHEE };
      CoachAppointmentsServiceMock.requestAppointment.mockResolvedValue(
        coachAppointmentMock,
      );
      const res = await resolver.requestAppointment(
        sessionCoacheeMock,
        requestCoachAppointmentDtoMock,
      );
      expect(res).toBeDefined();
      expect(res).toEqual(coachAppointmentMock);
    });
  });

  describe('coachPostponeAppointment', () => {
    const postponeCoachAppointmentDtoMock = {
      appointmentId: coachAppointmentMock.id,
    };
    it('should call coachPostponeAppointment method', async () => {
      CoachAppointmentsServiceMock.coachPostponeAppointment.mockResolvedValue(
        coachAppointmentMock,
      );
      const res = await resolver.coachPostponeAppointment(
        sessionMock,
        postponeCoachAppointmentDtoMock,
      );
      expect(res).toBeDefined();
      expect(res).toEqual(coachAppointmentMock);
    });
  });

  describe('CoachConfirmAppointment', () => {
    it('should call CoachConfirmAppointment method', async () => {
      CoachAppointmentsServiceMock.coachConfirmAppointment.mockResolvedValue(
        coachAppointmentMock,
      );
      const res = await resolver.CoachConfirmAppointment(
        sessionMock,
        coachAppointmentMock.id,
      );
      expect(res).toBeDefined();
      expect(res).toEqual(coachAppointmentMock);
    });
  });
});
