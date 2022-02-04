import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';

describe('CoachingAreaService', () => {
  let service: CoachingAreaService;

  const coachingAreaMock = {
    id: 1,
    coach: {
      id: 1,
    },
    coachee: {
      id: 1,
    },
    appointmentRelated: {
      id: 1,
    },
    name: 'TEST_NAME',
    coverPicture: 'TEST_COVER_PICTURE',
    description: 'TEST_DESCRIPTION',
  };

  const data = {
    name: coachingAreaMock.name,
    coverPicture: coachingAreaMock.coverPicture,
    description: coachingAreaMock.description,
  };

  const coachingAreaRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingAreaService,
        {
          provide: getRepositoryToken(CoachingArea),
          useValue: coachingAreaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachingAreaService>(CoachingAreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachingArea', () => {
    beforeAll(() => {
      coachingAreaRepositoryMock.save.mockResolvedValue(coachingAreaMock);
      coachingAreaRepositoryMock.create.mockReturnValue(coachingAreaMock);
    });

    it('Should create a CoachingArea', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coachingAreaMock);
      expect(coachingAreaRepositoryMock.save).toHaveBeenCalledWith(
        coachingAreaMock,
      );
    });
  });

  describe('deleteCoachingAreas', () => {
    beforeAll(() => {
      coachingAreaRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coachingAreaMock],
        }),
      });
    });

    it('Should edit a CoachingArea', async () => {
      const result = await service.update(coachingAreaMock.id, data);

      expect(result).toEqual(coachingAreaMock);
      expect(coachingAreaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple CoachingAreas', async () => {
      const result = await service.update([coachingAreaMock.id], data);

      expect(result).toEqual([coachingAreaMock]);
      expect(coachingAreaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getCoachingAreas', () => {
    beforeAll(() => {
      coachingAreaRepositoryMock.find.mockResolvedValue([coachingAreaMock]);
    });

    it('Should return multiple CoachingAreas', async () => {
      const result = await service.findAll(undefined);

      expect(result).toEqual([coachingAreaMock]);
      expect(coachingAreaRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getCoachingArea', () => {
    beforeAll(() => {
      coachingAreaRepositoryMock.findOne.mockResolvedValue(coachingAreaMock);
    });

    it('Should return a CoachingArea', async () => {
      const result = await service.findOne(coachingAreaMock.id);

      expect(result).toEqual(coachingAreaMock);
      expect(coachingAreaRepositoryMock.findOne).toHaveBeenCalledWith(
        coachingAreaMock.id,
        undefined,
      );
    });
  });

  describe('deleteCoachingAreas', () => {
    beforeAll(() => {
      coachingAreaRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoachingArea', async () => {
      const result = await service.delete(coachingAreaMock.id);

      expect(result).toEqual(1);
      expect(coachingAreaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple CoachingAreas', async () => {
      const result = await service.delete([coachingAreaMock.id]);

      expect(result).toEqual(1);
      expect(coachingAreaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
