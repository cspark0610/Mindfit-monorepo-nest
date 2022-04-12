import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaRepository } from 'src/agenda/repositories/coachAgenda.repository';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { CreateCoachAgendaDto } from 'src/agenda/dto/coachAgenda.dto';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';

describe('CoachAgendaService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let service: CoachAgendaService;
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

  const data = {
    coachId: coachAgendaMock.coach.id,
    coachAgendaDays: coachAgendaMock.coachAgendaDays,
    coachAppointments: coachAgendaMock.coachAppointments,
    availabilityRange: coachAgendaMock.availabilityRange,
    outOfService: coachAgendaMock.outOfService,
  };
  const dayAvailabilityMock = {
    date: now,
    availability: [
      {
        from: now,
        to: now,
      },
    ],
  };
  const coachAgendaDayMock = {
    id: 1,
    coachAgenda: coachAgendaMock,
    day: now,
    availableHours: null,
    exclude: false,
  } as CoachAgendaDay;

  const coachAppointmentMock = {
    id: 1,
    coachAgenda: coachAgendaMock,
    coachingSession: null,
    startDate: now,
    endDate: now,
    remarks: 'DEFAULT_REAMRKS',
    coacheeConfirmation: null,
    coachConfirmation: null,
    accomplished: false,
  } as CoachAppointment;

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

  const CoachAppointmentServiceMock = {
    getCoachAppointmetsByDateRange: jest.fn(),
  };
  const CoachAgendaDayServiceMock = {
    getCoachAgendaDaysBetweenDates: jest.fn(),
  };
  const CoreConfigServiceMock = {
    getMaxDistanceForCoachAvalailabityQuery: jest.fn(),
    getDefaultSessionDuration: jest.fn(),
  };
  const CoachAgendaDayValidatorMock = {
    validateHoursIntervals: jest.fn(),
  };

  beforeEach(async () => {
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

  describe('update', () => {
    const updateData: Partial<CoachAgenda> = {
      availabilityRange: {},
      outOfService: true,
    };
    const updatedCoachAgendaMock = {
      ...coachAgendaMock,
      outOfService: updateData.outOfService,
    } as CoachAgenda;
    it('should call repository.update', async () => {
      CoachAgendaDayValidatorMock.validateHoursIntervals.mockResolvedValue(
        true,
      );
      CoachAgendaRepositoryMock.update.mockResolvedValue(
        updatedCoachAgendaMock,
      );
      const result = await service.update(coachAgendaMock.id, updateData);
      expect(result).toBeDefined();
      expect(result).toEqual(updatedCoachAgendaMock);
    });
  });

  describe('create', () => {
    it('should call repository.create', async () => {
      jest
        .spyOn(CreateCoachAgendaDto, 'from')
        .mockImplementation()
        .mockResolvedValue(data as Partial<CreateCoachAgendaDto>);

      CoachAgendaRepositoryMock.create.mockResolvedValue(coachAgendaMock);

      const result = await service.create(
        data as Partial<CreateCoachAgendaDto>,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAgendaMock);
    });
  });

  describe('getAvailabilityByMonths', () => {
    const dayAvailabilityArrayMock = [{ ...dayAvailabilityMock }];
    const fromDate = now;
    const toDate = now;
    it(' should return an array DayAvailabilityObjectType', async () => {
      CoreConfigServiceMock.getMaxDistanceForCoachAvalailabityQuery.mockResolvedValue(
        '1',
      );
      CoreConfigServiceMock.getDefaultSessionDuration.mockResolvedValue('30');
      CoachAgendaDayServiceMock.getCoachAgendaDaysBetweenDates.mockResolvedValue(
        coachAgendaDayMock,
      );
      CoachAppointmentServiceMock.getCoachAppointmetsByDateRange.mockResolvedValue(
        coachAppointmentMock,
      );
      jest
        .spyOn(service, 'getAvailabilityByMonths')
        .mockImplementation()
        .mockResolvedValue(dayAvailabilityArrayMock);

      const result = await service.getAvailabilityByMonths(
        coachAgendaMock as CoachAgenda,
        fromDate,
        toDate,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(dayAvailabilityArrayMock);
    });
  });
});
