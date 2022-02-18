import { Test, TestingModule } from '@nestjs/testing';
import { CoachAppointmentRepository } from 'src/agenda/repositories/coachAppointment.repository';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';

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
      ],
    }).compile();

    service = module.get<CoachAppointmentService>(CoachAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
