import { Test, TestingModule } from '@nestjs/testing';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { CoachAppointmentValidator } from 'src/agenda/resolvers/validators/CoachAppointmentValidator';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { UsersService } from 'src/users/services/users.service';

describe('CoachAppointmentService', () => {
  let service: CoachAppointmentService;

  // const coachAgendaDayMock = {
  //   id: 1,
  //   coachAgenda: {
  //     id: 1,
  //   },
  //   coachee: {
  //     id: 1,
  //   },
  //   coach: {
  //     id: 1,
  //   },
  //   coachingSession: {
  //     id: 1,
  //   },
  //   title: 'TEST_TITLE',
  //   date: new Date(),
  //   remarks: 'TEST_REMARKS',
  //   coacheeConfirmation: new Date(),
  //   coachConfirmation: new Date(),
  //   accomplished: false,
  // };

  // const data = {
  //   coachAgendaId: coachAgendaDayMock.coachAgenda.id,
  //   coacheeId: coachAgendaDayMock.coachee.id,
  //   title: coachAgendaDayMock.title,
  //   date: coachAgendaDayMock.date,
  //   remarks: coachAgendaDayMock.remarks,
  //   coacheeConfirmation: coachAgendaDayMock.coacheeConfirmation,
  //   coachConfirmation: coachAgendaDayMock.coachConfirmation,
  //   accomplished: coachAgendaDayMock.accomplished,
  // };

  const CoachAppointmentRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  const CoachingSessionServiceMock = {};

  const CoachAppointmentValidatorMock = {};

  const CoacheeServiceMock = {};

  const CoachAgendaServiceMock = {};

  const UsersServiceMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();
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
});
