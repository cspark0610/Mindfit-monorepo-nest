import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeService } from 'src/coaching/services/coachee.service';

describe('CoacheeService', () => {
  let service: CoacheeService;

  const coacheeMock = {
    id: 1,
    user: {
      id: 1,
    },
    organizations: [
      {
        id: 1,
      },
    ],
    coachingAreas: [],
    coachAppointments: [],
    coachNotes: [],
    coachingSessions: [],
    coacheeEvaluations: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    profilePicture: 'TEST_PROFILE_PICTURE',
    position: 'TEST_POSITION',
    isAdmin: false,
    isActive: true,
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
  };

  const data = {
    userId: coacheeMock.user.id,
    organizationsId: coacheeMock.organizations.map(({ id }) => id),
    coachingAreasId: coacheeMock.coachingAreas.map(({ id }) => id),
    phoneNumber: coacheeMock.phoneNumber,
    profilePicture: coacheeMock.profilePicture,
    position: coacheeMock.position,
    isAdmin: coacheeMock.isAdmin,
    canViewDashboard: coacheeMock.canViewDashboard,
    bio: coacheeMock.bio,
    aboutPosition: coacheeMock.aboutPosition,
  };

  const coacheeRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeService,
        {
          provide: getRepositoryToken(Coachee),
          useValue: coacheeRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoacheeService>(CoacheeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachee', () => {
    beforeAll(() => {
      coacheeRepositoryMock.save.mockResolvedValue(coacheeMock);
      coacheeRepositoryMock.create.mockReturnValue(coacheeMock);
    });

    it('Should create a Coachee', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coacheeMock);
      expect(coacheeRepositoryMock.create).toHaveBeenCalledWith(data);
      expect(coacheeRepositoryMock.save).toHaveBeenCalledWith(coacheeMock);
    });
  });

  describe('editCoachees', () => {
    beforeAll(() => {
      coacheeRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coacheeMock],
        }),
      });
    });

    it('Should edit a Coachee', async () => {
      const result = await service.update(coacheeMock.id, data);

      expect(result).toEqual(coacheeMock);
      expect(coacheeRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple Coachees', async () => {
      const result = await service.update([coacheeMock.id], data);

      expect(result).toEqual([coacheeMock]);
      expect(coacheeRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getCoachees', () => {
    beforeAll(() => {
      coacheeRepositoryMock.find.mockResolvedValue([coacheeMock]);
    });

    it('Should return multiple Coachs', async () => {
      const result = await service.findAll();

      expect(result).toEqual([coacheeMock]);
      expect(coacheeRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getCoachee', () => {
    beforeAll(() => {
      coacheeRepositoryMock.findOne.mockResolvedValue(coacheeMock);
    });

    it('Should return a Coach', async () => {
      const result = await service.findOne(coacheeMock.id);

      expect(result).toEqual(coacheeMock);
      expect(coacheeRepositoryMock.findOne).toHaveBeenCalledWith(
        coacheeMock.id,
        {
          relations: ['organization'],
        },
      );
    });
  });

  describe('deleteCoachs', () => {
    beforeAll(() => {
      coacheeRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific Coach', async () => {
      const result = await service.delete(coacheeMock.id);

      expect(result).toEqual(1);
      expect(coacheeRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple Coachs', async () => {
      const result = await service.delete([coacheeMock.id]);

      expect(result).toEqual(1);
      expect(coacheeRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
