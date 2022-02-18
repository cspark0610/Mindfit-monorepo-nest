import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { CoachService } from 'src/coaching/services/coach.service';

describe('CoachService', () => {
  let service: CoachService;

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
    profilePicture: 'TEST_PROFILE_PICTURE',
    videoPresentation: 'TEST_VIDEO_PRESENTATION',
    phoneNumber: 'TEST_PHONE_NUMBER',
    isActive: true,
  };

  const CoachRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  const CoachAgendaServiceMock = {
    create: jest.fn(),
  };

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
      ],
    }).compile();

    service = module.get<CoachService>(CoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoachs', () => {
    beforeAll(() => {
      CoachRepositoryMock.findAll.mockResolvedValue([coachMock]);
    });

    it('Should return multiple Coachs', async () => {
      const result = await service.findAll();

      expect(result).toEqual([coachMock]);
      expect(CoachRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getCoach', () => {
    beforeAll(() => {
      CoachRepositoryMock.findOneBy.mockResolvedValue(coachMock);
    });

    it('Should return a Coach', async () => {
      const result = await service.findOne(coachMock.id);

      expect(result).toEqual(coachMock);
      expect(CoachRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: coachMock.id,
      });
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
});
