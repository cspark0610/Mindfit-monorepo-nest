import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaDayRepository } from 'src/agenda/repositories/coachAgendaDay.repository';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import dayjs from 'dayjs';

describe('CoachAgendaDayService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let service: CoachAgendaDayService;
  const now = new Date();
  const coachAgendaDayMock = {
    id: 1,
    coachAgenda: {
      id: 1,
    } as CoachAgenda,
    day: now,
    availableHours: [],
    exclude: false,
  };
  const coachAgendaDayArrayMock = [{ ...coachAgendaDayMock }];

  // const createData = {
  //   coachAgendaId: coachAgendaDayMock.coachAgenda.id,
  //   day: coachAgendaDayMock.day,
  //   availableHours: coachAgendaDayMock.availableHours,
  //   exclude: coachAgendaDayMock.exclude,
  // };

  const CoachAgendaDayRepositoryMock = {
    findAll: jest.fn(),
    getCoachAgendaDaysBetweenDates: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAgendaDayService,
        {
          provide: CoachAgendaDayRepository,
          useValue: CoachAgendaDayRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachAgendaDayService>(CoachAgendaDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDayConfig', () => {
    it('should return the coachAgendaDay array', async () => {
      CoachAgendaDayRepositoryMock.findAll.mockResolvedValue(
        coachAgendaDayArrayMock,
      );
      const result = await service.getDayConfig(
        coachAgendaDayMock.coachAgenda,
        coachAgendaDayMock.day,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAgendaDayArrayMock);
    });
  });

  describe('getCoachAgendaDaysBetweenDates', () => {
    const data = {
      coachAgendaId: coachAgendaDayMock.coachAgenda.id,
      from: now as unknown as dayjs.Dayjs,
      to: now as unknown as dayjs.Dayjs,
    };
    it('should return the coachAgendaDay array', async () => {
      CoachAgendaDayRepositoryMock.getCoachAgendaDaysBetweenDates.mockResolvedValue(
        coachAgendaDayArrayMock,
      );
      const result = await service.getCoachAgendaDaysBetweenDates(data);
      expect(result).toBeDefined();
      expect(result).toEqual(coachAgendaDayArrayMock);
    });
  });
});
