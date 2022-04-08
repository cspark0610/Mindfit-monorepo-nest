import { Test, TestingModule } from '@nestjs/testing';
import { CoachResolver } from 'src/coaching/resolvers/coach.resolver';
import { CoachService } from 'src/coaching/services/coach.service';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { Roles } from 'src/users/enums/roles.enum';

describe('CoachResolver', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  let resolver: CoachResolver;

  const coachDtoMock = {
    bio: 'TEST_BIO',
    coachApplicationId: 1,
    coachingAreas: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    userId: 1,
  };
  const editCoachDtoMock = {
    bio: 'update bio',
  };
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
  };
  const coachMock2 = { ...coachMock };

  const CoachsServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createManyCoach: jest.fn(),
    updateCoach: jest.fn(),
    updateManyCoaches: jest.fn(),
    deleteCoach: jest.fn(),
    deleteManyCoaches: jest.fn(),
    getCoachByUserEmail: jest.fn(),
  };

  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACH,
  };

  const historicalAssigmentServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachResolver,
        {
          provide: CoachService,
          useValue: CoachsServiceMock,
        },
        {
          provide: HistoricalAssigmentService,
          useValue: historicalAssigmentServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoachResolver>(CoachResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllCoaches', () => {
    beforeAll(() => {
      CoachsServiceMock.findAll.mockResolvedValue([coachMock]);
    });
    it('should call findAll and return and array of coaches', async () => {
      const result = await resolver.findAll();
      expect(CoachsServiceMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([coachMock]);
    });
  });

  describe('findCoachById', () => {
    beforeAll(() => {
      CoachsServiceMock.findOne.mockResolvedValue(coachMock);
    });
    it('should call findOne and return and a coach by id', async () => {
      const result = await resolver.findOne(coachMock.id);
      expect(CoachsServiceMock.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachMock);
    });
  });

  describe('createCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.create.mockResolvedValue(coachMock);
    });
    it('should call create and return and a new coach', async () => {
      const result = await resolver.create(coachDtoMock);
      expect(CoachsServiceMock.create).toHaveBeenCalled();
      expect(CoachsServiceMock.create).toHaveBeenCalledWith(coachDtoMock);
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachMock);
    });
  });

  describe('createManyCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.createManyCoach.mockResolvedValue([
        coachMock,
        coachMock2,
      ]);
    });
    it('should call createMany and return and a array of coachs', async () => {
      const result = await resolver.createMany([coachDtoMock, coachDtoMock]);
      expect(CoachsServiceMock.createManyCoach).toHaveBeenCalledWith([
        coachDtoMock,
        coachDtoMock,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(coachMock);
      expect(result[1]).toEqual(coachMock2);
    });
  });

  describe('updateCoach', () => {
    const editCoachDto = { bio: 'update bio' };
    const updatedCoach = { ...coachMock, bio: 'update bio' };
    beforeAll(() => {
      CoachsServiceMock.updateCoach.mockResolvedValue(updatedCoach);
    });
    it('should call update and return and coach updated', async () => {
      const result = await resolver.update(sessionMock, editCoachDtoMock);
      expect(CoachsServiceMock.updateCoach).toHaveBeenCalledWith(
        sessionMock,
        editCoachDto,
      );
      expect(result).toEqual(updatedCoach);
    });
  });

  describe('updateManyCoaches', () => {
    const editCoachDto = { bio: 'update bio' };
    const updatedCoaches = [
      { ...coachMock, bio: 'update bio' },
      { ...coachMock, bio: 'update bio' },
    ];
    const ids = [coachMock.id, coachMock2.id];
    beforeAll(() => {
      CoachsServiceMock.updateManyCoaches.mockResolvedValue(updatedCoaches);
    });
    it('should call updateManyCoaches and return and a array of updated coaches', async () => {
      const result = await resolver.updateMany(
        sessionMock,
        ids,
        editCoachDtoMock,
      );
      expect(CoachsServiceMock.updateManyCoaches).toHaveBeenCalledWith(
        sessionMock,
        ids,
        editCoachDto,
      );
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual(updatedCoaches[0]);
      expect(result[1]).toEqual(updatedCoaches[1]);
    });
  });

  describe('deleteCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.deleteCoach.mockResolvedValue(coachMock.id);
    });
    it('should call delete and return the id of the coach deleted', async () => {
      const result = await resolver.delete(sessionMock, coachMock.id);
      expect(CoachsServiceMock.deleteCoach).toHaveBeenCalledWith(
        sessionMock,
        coachMock.id,
      );
      expect(result).toEqual(coachMock.id);
    });
  });

  describe('deleteManyCoaches', () => {
    beforeAll(() => {
      CoachsServiceMock.deleteManyCoaches.mockResolvedValue([
        coachMock.id,
        coachMock2.id,
      ]);
    });
    it('should call deleteMany and return an array of ids of the coaches deleted', async () => {
      const result = await resolver.deleteMany(sessionMock, [
        coachMock.id,
        coachMock2.id,
      ]);
      expect(CoachsServiceMock.deleteManyCoaches).toHaveBeenCalledWith(
        sessionMock,
        [coachMock.id, coachMock2.id],
      );
      expect(result).toEqual([coachMock.id, coachMock2.id]);
      expect(result[0]).toBe(coachMock.id);
      expect(result[1]).toBe(coachMock2.id);
    });
  });
});
