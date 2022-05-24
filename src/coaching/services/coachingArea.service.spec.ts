import { Test, TestingModule } from '@nestjs/testing';
import { CoachingAreaRepository } from 'src/coaching/repositories/coachingArea.repository';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';

describe('CoachingAreaService', () => {
  let service: CoachingAreaService;

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

  const CoachingAreaRepositoryMock = {
    findAll: jest.fn(),
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
        CoachingAreaService,
        {
          provide: CoachingAreaRepository,
          useValue: CoachingAreaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachingAreaService>(CoachingAreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCoachingAreas', () => {
    beforeAll(() => {
      CoachingAreaRepositoryMock.findAll.mockResolvedValue([coachingAreaMock]);
    });
    it('should call findAll and return and array of coachingAreas', async () => {
      const result = await service.findAll({});
      expect(CoachingAreaRepositoryMock.findAll).toHaveBeenCalledWith(
        {},
        undefined,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([coachingAreaMock]);
    });
  });

  describe('findAllCoachingAreasById', () => {
    beforeAll(() => {
      CoachingAreaRepositoryMock.findOneBy.mockResolvedValue(coachingAreaMock);
    });
    it('should call findOneBy and return and a coacheeEvaluation by id', async () => {
      const result = await service.findOneBy({
        where: { id: coachingAreaMock.id },
      });
      expect(CoachingAreaRepositoryMock.findOneBy).toHaveBeenCalledWith(
        {
          id: coachingAreaMock.id,
        },
        undefined,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachingAreaMock);
    });
  });

  describe('createCoachingArea', () => {
    beforeAll(() => {
      CoachingAreaRepositoryMock.create.mockResolvedValue(coachingAreaMock);
    });
    it('should call create and return and a new coacheeEvaluation', async () => {
      const result = await service.create(data);
      expect(CoachingAreaRepositoryMock.create).toHaveBeenCalled();
      expect(CoachingAreaRepositoryMock.create).toHaveBeenCalledWith(data);
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachingAreaMock);
    });
  });

  describe('createManyCoachingAreas', () => {
    beforeAll(() => {
      CoachingAreaRepositoryMock.createMany.mockResolvedValue([
        coachingAreaMock,
        coachingAreaMock2,
      ]);
    });
    it('should call createMany and return and a array of coachingAreas', async () => {
      const result = await service.createMany([data, data]);
      expect(CoachingAreaRepositoryMock.createMany).toHaveBeenCalled();
      expect(CoachingAreaRepositoryMock.createMany).toHaveBeenCalledWith([
        data,
        data,
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
      ...coachingAreaMock,
      description: 'update description',
    };
    beforeAll(() => {
      CoachingAreaRepositoryMock.update.mockResolvedValue(updatedCoachingArea);
    });
    it('should call update and return a coachingArea updated', async () => {
      const result = await service.update(
        coachingAreaMock.id,
        editCoachingAreaDtoMock,
      );
      expect(CoachingAreaRepositoryMock.update).toHaveBeenCalled();
      expect(CoachingAreaRepositoryMock.update).toHaveBeenCalledWith(
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
      CoachingAreaRepositoryMock.updateMany.mockResolvedValue(
        updatedCoachingAreas,
      );
    });
    it('should call updateMany and return and a array of updated coachingAreas', async () => {
      const result = await service.updateMany(ids, editCoachingAreaDtoMock);
      expect(CoachingAreaRepositoryMock.updateMany).toHaveBeenCalled();
      expect(CoachingAreaRepositoryMock.updateMany).toHaveBeenCalledWith(
        ids,
        editCoachingAreaDtoMock,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(updatedCoachingAreas[0]);
      expect(result[1]).toEqual(updatedCoachingAreas[1]);
    });
  });

  describe('deleteCoachingAreas', () => {
    beforeAll(() => {
      CoachingAreaRepositoryMock.delete.mockResolvedValue(coachingAreaMock.id);
    });
    it('should call delete and return the id of the coachingArea deleted', async () => {
      const result = await service.delete(coachingAreaMock.id);
      expect(CoachingAreaRepositoryMock.delete).toHaveBeenCalled();
      expect(CoachingAreaRepositoryMock.delete).toHaveBeenCalledWith(
        coachingAreaMock.id,
      );
      expect(result).toBe(coachingAreaMock.id);
    });
  });
});
