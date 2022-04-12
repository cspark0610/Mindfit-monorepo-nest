import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeAgendaService } from 'src/agenda/services/coacheeAgenda.service';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import { CoacheeAgenda } from 'src/agenda/models/coacheeAgenda.model';
import { Coachee } from 'src/coaching/models/coachee.model';

describe('CoacheeAgendaService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let service: CoacheeAgendaService;
  const now = new Date();
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
  const satReportArrayMock = [];

  const CoachAppointmentServiceMock = {
    getCoacheeAppointmentsByDateRange: jest.fn(),
  };
  const SatReportsServiceMock = {
    getSatReportByCoacheeIdAndDateRange: jest.fn(),
  };
  const CoacheeServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeAgendaService,
        {
          provide: CoachAppointmentService,
          useValue: CoachAppointmentServiceMock,
        },
        {
          provide: SatReportsService,
          useValue: SatReportsServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();
    service = module.get<CoacheeAgendaService>(CoacheeAgendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoacheeAgendaByDateRange', () => {
    it('should return a CoacheeAgenda', async () => {
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);
      CoachAppointmentServiceMock.getCoacheeAppointmentsByDateRange.mockResolvedValue(
        coachAppointmentArrayMock,
      );
      SatReportsServiceMock.getSatReportByCoacheeIdAndDateRange.mockResolvedValue(
        satReportArrayMock,
      );

      jest
        .spyOn(service, 'getCoacheeAgendaByDateRange')
        .mockImplementation()
        .mockResolvedValue(coacheeAgendaMock);

      const result = await service.getCoacheeAgendaByDateRange(
        coacheeMock.id,
        now,
        now,
      );

      expect(result).toBeDefined();
      expect(result).toEqual(coacheeAgendaMock);
    });
  });
});
