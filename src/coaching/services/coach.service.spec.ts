import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { CoachService } from 'src/coaching/services/coach.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import {
  DEFAULT_COACH_IMAGE,
  DEFAULT_COACH_VIDEO,
} from 'src/coaching/utils/coach.constants';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { UsersService } from 'src/users/services/users.service';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';

describe('CoachService', () => {
  let service: CoachService;
  let repository: CoachRepository;
  let coachAgendaService: CoachAgendaService;

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
    profilePicture: DEFAULT_COACH_IMAGE,
    videoPresentation: DEFAULT_COACH_VIDEO,
    phoneNumber: 'TEST_PHONE_NUMBER',
    isActive: true,
  };

  const arrayOfCoachesMock = [
    { ...coachMock },
    { ...coachMock, id: 2 },
    { ...coachMock, id: 3 },
  ];
  const CoachRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn().mockResolvedValue(coachMock),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    getInServiceCoaches: jest.fn().mockResolvedValue(coachMock),
  };

  const CoachAgendaMock = {
    ...coachMock,
    outOfService: true,
  };

  const CoachAgendaServiceMock = {
    create: jest.fn(),
  };
  const CoacheeServiceMock = {
    getHistoricalCoacheeData: jest.fn(),
  };
  const HistoricalAssigmentServiceMock = {};
  const CoreConfigServiceMock = {};
  const CoachAppointmentServiceMock = {};
  const AwsS3ServiceMock = {};
  const UsersServiceMock = {};
  const CoachingAreaServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachService,
        {
          provide: CoachRepository,
          useValue: CoachRepositoryMock,
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
          provide: HistoricalAssigmentService,
          useValue: HistoricalAssigmentServiceMock,
        },
        {
          provide: CoreConfigService,
          useValue: CoreConfigServiceMock,
        },
        {
          provide: AwsS3Service,
          useValue: AwsS3ServiceMock,
        },
        {
          provide: CoachingAreaService,
          useValue: CoachingAreaServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoachAppointmentService,
          useValue: CoachAppointmentServiceMock,
        },
      ],
    }).compile();

    service = module.get<CoachService>(CoachService);
    repository = module.get<CoachRepository>(CoachRepository);
    coachAgendaService = module.get<CoachAgendaService>(CoachAgendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoachs', () => {
    beforeAll(() => {
      CoachRepositoryMock.findAll.mockResolvedValue([coachMock]);
    });

    it('Should return multiple Coachs', async () => {
      const result = await service.findAll({});
      expect(result).toEqual([coachMock]);
      expect(CoachRepositoryMock.findAll).toHaveBeenCalledWith({}, undefined);
    });
  });

  describe('getCoach', () => {
    beforeAll(() => {
      CoachRepositoryMock.findOneBy.mockResolvedValue(coachMock);
    });

    it('Should return a Coach', async () => {
      const result = await service.findOne({ id: coachMock.id });
      expect(result).toEqual(coachMock);
      expect(CoachRepositoryMock.findOneBy).toHaveBeenCalledWith(
        {
          id: coachMock.id,
        },
        undefined,
      );
    });
  });

  describe('deleteCoachs', () => {
    beforeAll(() => {
      CoachRepositoryMock.delete.mockReturnValue(1);
    });

    it('Should delete a specific Coach', async () => {
      const result = await service.delete(coachMock.id);

      expect(result).toEqual(1);
      expect(CoachRepositoryMock.delete).toHaveBeenCalledWith(coachMock.id);
    });

    it('Should delete multiple Coachs', async () => {
      const result = await service.delete([coachMock.id]);

      expect(result).toEqual(1);
      expect(CoachRepositoryMock.delete).toHaveBeenCalledWith([coachMock.id]);
    });
  });

  describe('createCoach', () => {
    beforeAll(() => {
      CoachRepositoryMock.findOneBy.mockResolvedValue(coachMock);
    });
    it('should create a coach and its agenda', async () => {
      const coach = await repository.create(coachMock as any);
      jest
        .spyOn(coachAgendaService, 'create')
        .mockResolvedValue(CoachAgendaMock as any);

      expect(
        coachAgendaService.create({ ...coach, outOfService: true }),
      ).resolves.toMatchObject(CoachAgendaMock);

      expect(repository.findOneBy({ id: coach.id })).resolves.toMatchObject(
        coachMock,
      );
    });
  });

  describe('updateCoach', () => {
    beforeAll(() => {
      CoachRepositoryMock.update.mockResolvedValue({
        ...coachMock,
        bio: 'update bio',
      });
    });
    it('should update a coach', async () => {
      const result = await service.update(coachMock.id, { bio: 'update bio' });
      expect(CoachRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(
        service.update(coachMock.id, { bio: 'update bio' }),
      ).resolves.toMatchObject(result);
    });
  });

  describe('getInServiceCoaches', () => {
    it('should return an array of coaches', async () => {
      const result = await repository.getInServiceCoaches({ exclude: [] });
      expect(CoachRepositoryMock.getInServiceCoaches).toHaveBeenCalledTimes(1);
      expect(
        repository.getInServiceCoaches({ exclude: [] }),
      ).resolves.toMatchObject(result);
    });
  });

  describe('getRandomInServiceCoaches', () => {
    beforeAll(() => {
      CoachRepositoryMock.getInServiceCoaches.mockResolvedValue(
        arrayOfCoachesMock,
      );
    });
    it('should return an unordered array of coaches of $quantity length ', async () => {
      const quantity = 3;
      const result = await service.getRandomInServiceCoaches(quantity, [1]);
      expect(CoachRepositoryMock.getInServiceCoaches).toHaveBeenCalled();
      expect(CoachRepositoryMock.getInServiceCoaches).toBeCalledWith({
        exclude: [1],
      });
      expect(result.length).toBe(quantity);
    });
  });
});
