import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaDayRepository } from 'src/agenda/repositories/coachAgendaDay.repository';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';

describe('CoachAgendaDayService', () => {
  let service: CoachAgendaDayService;

  // const coachAgendaDayMock = {
  //   id: 1,
  //   coachAgenda: {
  //     id: 1,
  //   },
  //   day: new Date(),
  //   availableHours: 'TEST_AVAILABILITY_HOURS',
  //   exclude: false,
  // };

  // const data = {
  //   coachAgendaId: coachAgendaDayMock.coachAgenda.id,
  //   day: coachAgendaDayMock.day,
  //   availableHours: coachAgendaDayMock.availableHours,
  //   exclude: coachAgendaDayMock.exclude,
  // };

  const CoachAgendaDayRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
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
});
