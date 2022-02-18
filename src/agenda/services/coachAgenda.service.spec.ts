import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaRepository } from 'src/agenda/repositories/coachAgenda.repository';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoreConfigService } from 'src/config/services/coreConfig.service';

describe('CoachAgendaService', () => {
  let service: CoachAgendaService;

  // const coachAgendaMock = {
  //   id: 1,
  //   coach: {
  //     id: 1,
  //   },
  //   coachAgendaDays: [],
  //   coachAppointments: [],
  //   availabilityRange: 'TEST_AVAILABILITY_RANGE',
  //   outOfService: false,
  // };

  // const data = {
  //   coachId: coachAgendaMock.coach.id,
  //   coachAgendaDays: coachAgendaMock.coachAgendaDays,
  //   coachAppointments: coachAgendaMock.coachAppointments,
  //   availabilityRange: coachAgendaMock.availabilityRange,
  //   outOfService: coachAgendaMock.outOfService,
  // };

  const CoachAgendaRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  const CoachAppointmentServiceMock = {};
  const CoachAgendaDayServiceMock = {};
  const CoreConfigServiceMock = {};
  const CoachAgendaDayValidatorMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAgendaService,
        {
          provide: CoachAgendaRepository,
          useValue: CoachAgendaRepositoryMock,
        },
        {
          provide: CoachAppointmentService,
          useValue: CoachAppointmentServiceMock,
        },
        {
          provide: CoachAgendaDayService,
          useValue: CoachAgendaDayServiceMock,
        },
        {
          provide: CoreConfigService,
          useValue: CoreConfigServiceMock,
        },
        {
          provide: CoachAgendaDayValidator,
          useValue: CoachAgendaDayValidatorMock,
        },
      ],
    }).compile();

    service = module.get<CoachAgendaService>(CoachAgendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
