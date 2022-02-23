import { Test, TestingModule } from '@nestjs/testing';
import { CoachingAreaResolver } from './coachingArea.resolver';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';

describe('CoachingAreaResolver', () => {
  let resolver: CoachingAreaResolver;

  const coachMock = {
    id: 1,
    user: {
      id: 1,
    },
  };
  const coacheeMock = {
    id: 1,
    user: {
      id: 1,
    },
    organizations: [{ id: 1 }],
  };
  const coachingAreaMock = {
    id: 1,
    coach: coachMock,
    coachee: coacheeMock,
    appointmentRelated: {
      id: 1,
    },
    name: 'TEST_NAME',
    coverPicture: 'TEST_COVER_PICTURE',
    description: 'TEST_DESCRIPTION',
  };
  const coachingAreaMock2 = { ...coachingAreaMock, id: 2 };

  const data = {
    name: coachingAreaMock.name,
    coverPicture: coachingAreaMock.coverPicture,
    description: coachingAreaMock.description,
  };

  const editCoachingAreaDtoMock = {
    description: 'update description',
  };

  const CoachingAreaServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingAreaResolver,
        {
          provide: CoachingAreaService,
          useValue: CoachingAreaServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoachingAreaResolver>(CoachingAreaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllCoachingAreas', () => {
    beforeAll(() => {
      CoachingAreaServiceMock.findAll.mockResolvedValue([coachingAreaMock]);
    });
    it('should call findAll and return and array of coachingAreas', async () => {
      const result = await resolver.findAll();
      expect(CoachingAreaServiceMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([coachingAreaMock]);
    });
  });

  describe('findCoachingAreaById', () => {
    beforeAll(() => {
      CoachingAreaServiceMock.findOne.mockResolvedValue(coachingAreaMock);
    });
    it('should call findOne and return and a coachingArea by id', async () => {
      const result = await resolver.findOne(coachingAreaMock.id);
      expect(CoachingAreaServiceMock.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachingAreaMock);
    });
  });

  describe('createCoachingArea', () => {
    beforeAll(() => {
      CoachingAreaServiceMock.create.mockResolvedValue(coachingAreaMock);
    });
    it('should call create and return and a new coachingArea', async () => {
      const result = await resolver.create(data);
      expect(CoachingAreaServiceMock.create).toHaveBeenCalled();
      expect(CoachingAreaServiceMock.create).toHaveBeenCalledWith(data);
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachingAreaMock);
    });
  });

  describe('createManyCoachingArea', () => {
    beforeAll(() => {
      CoachingAreaServiceMock.createMany.mockResolvedValue([
        coachingAreaMock,
        coachingAreaMock2,
      ]);
    });
    it('should call createMany and return and a array of coachingAreas', async () => {
      const result = await resolver.createMany([
        coachingAreaMock,
        coachingAreaMock2,
      ]);
      expect(CoachingAreaServiceMock.createMany).toHaveBeenCalled();
      expect(CoachingAreaServiceMock.createMany).toHaveBeenCalledWith([
        coachingAreaMock,
        coachingAreaMock2,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(coachingAreaMock);
      expect(result[1]).toEqual(coachingAreaMock2);
    });
  });

  describe('updateCoachingArea', () => {
    const updatedCoachingArea = {
      ...coachMock,
      description: 'update description',
    };
    beforeAll(() => {
      CoachingAreaServiceMock.update.mockResolvedValue(updatedCoachingArea);
    });
    it('should call update and return a coachingArea updated', async () => {
      const result = await resolver.update(
        coachingAreaMock.id,
        editCoachingAreaDtoMock,
      );
      expect(CoachingAreaServiceMock.update).toHaveBeenCalled();
      expect(CoachingAreaServiceMock.update).toHaveBeenCalledWith(
        coachingAreaMock.id,
        editCoachingAreaDtoMock,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(updatedCoachingArea);
    });
  });

  describe('updateManyCoachingAreas', () => {
    const updatedCoachingAreas = [
      { ...coachingAreaMock, description: 'update description' },
      { ...coachingAreaMock2, description: 'update description' },
    ];
    const ids = [coachingAreaMock.id, coachingAreaMock2.id];
    beforeAll(() => {
      CoachingAreaServiceMock.updateMany.mockResolvedValue(
        updatedCoachingAreas,
      );
    });
    it('should call updateMany and return and a array of updated coachingAreas', async () => {
      const result = await resolver.updateMany(editCoachingAreaDtoMock, ids);
      expect(CoachingAreaServiceMock.updateMany).toHaveBeenCalled();
      expect(CoachingAreaServiceMock.updateMany).toHaveBeenCalledWith(
        editCoachingAreaDtoMock,
        ids,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(updatedCoachingAreas[0]);
      expect(result[1]).toEqual(updatedCoachingAreas[1]);
    });
  });

  describe('deleteManyCoachingAreas', () => {
    beforeAll(() => {
      CoachingAreaServiceMock.delete.mockResolvedValue(coachingAreaMock.id);
    });
    it('should call delete and return the id of the coachingArea deleted', async () => {
      const result = await resolver.delete(coachingAreaMock.id);
      expect(CoachingAreaServiceMock.delete).toHaveBeenCalled();
      expect(CoachingAreaServiceMock.delete).toHaveBeenCalledWith(
        coachingAreaMock.id,
      );
      expect(result).toBe(coachingAreaMock.id);
    });
  });

  describe('deleteManyCoachingAreas', () => {
    beforeAll(() => {
      CoachingAreaServiceMock.delete.mockResolvedValue([
        coachingAreaMock.id,
        coachingAreaMock2.id,
      ]);
    });
    it('should call delete and return an array of ids of the coachingAreas deleted', async () => {
      const result = await resolver.deleteMany([
        coachingAreaMock.id,
        coachingAreaMock2.id,
      ]);

      expect(CoachingAreaServiceMock.delete).toHaveBeenCalled();
      expect(CoachingAreaServiceMock.delete).toHaveBeenCalledWith([
        coachingAreaMock.id,
        coachingAreaMock2.id,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBe(coachingAreaMock.id);
      expect(result[1]).toBe(coachingAreaMock2.id);
    });
  });
});
