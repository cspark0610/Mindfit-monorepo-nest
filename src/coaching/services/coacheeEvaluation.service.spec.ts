import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeEvaluationRepository } from 'src/coaching/repositories/coacheeEvaluation.repository';
import { CoacheeEvaluationService } from 'src/coaching/services/coacheeEvaluation.service';

describe('CoacheeEvaluationService', () => {
  let service: CoacheeEvaluationService;

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
  const coacheeEvaluationMock = {
    id: 1,
    coach: coachMock,
    coachee: coacheeMock,
    appointmentRelated: {
      id: 1,
    },
    evaluation: 'TEST_EVALUATION',
  };
  const coacheeEvaluationMock2 = { ...coacheeEvaluationMock, id: 2 };

  const createCoacheeEvaluationDtoMock = {
    coachId: coacheeEvaluationMock.coach.id,
    coacheeId: coacheeEvaluationMock.coachee.id,
    evaluation: coacheeEvaluationMock.evaluation,
  };
  const editCoacheeEvaluationDtoMock = {
    evaluation: 'update evaluation',
  };

  const CoacheeEvaluationRepositoryMock = {
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
        CoacheeEvaluationService,
        {
          provide: CoacheeEvaluationRepository,
          useValue: CoacheeEvaluationRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoacheeEvaluationService>(CoacheeEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCoacheesEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.findAll.mockResolvedValue([
        coacheeEvaluationMock,
      ]);
    });
    it('should call findAll and return and array of coacheeEvaluation', async () => {
      const result = await service.findAll();
      expect(CoacheeEvaluationRepositoryMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([coacheeEvaluationMock]);
    });
  });

  describe('findAllCoacheesEvaluationById', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.findOneBy.mockResolvedValue(
        coacheeEvaluationMock,
      );
    });
    it('should call findOneBy and return and a coacheeEvaluation by id', async () => {
      //const result = await service.findOne(coacheeEvaluationMock.id);
      const result = await service.findOneBy(coacheeEvaluationMock.id as any);
      expect(CoacheeEvaluationRepositoryMock.findOneBy).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.findOneBy).toHaveBeenCalledWith(
        coacheeEvaluationMock.id,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coacheeEvaluationMock);
    });
  });

  describe('createCoacheeEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.create.mockResolvedValue(
        coacheeEvaluationMock,
      );
    });
    it('should call create and return and a new coacheeEvaluation', async () => {
      const result = await service.create(createCoacheeEvaluationDtoMock);
      expect(CoacheeEvaluationRepositoryMock.create).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.create).toHaveBeenCalledWith(
        createCoacheeEvaluationDtoMock,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coacheeEvaluationMock);
    });
  });

  describe('createManyCoacheeEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.createMany.mockResolvedValue([
        coacheeEvaluationMock,
        coacheeEvaluationMock2,
      ]);
    });
    it('should call createMany and return and a array of coacheeEvaluation', async () => {
      const result = await service.createMany([
        createCoacheeEvaluationDtoMock,
        createCoacheeEvaluationDtoMock,
      ]);
      expect(CoacheeEvaluationRepositoryMock.createMany).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.createMany).toHaveBeenCalledWith([
        createCoacheeEvaluationDtoMock,
        createCoacheeEvaluationDtoMock,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(coacheeEvaluationMock);
      expect(result[1]).toEqual(coacheeEvaluationMock2);
    });
  });

  describe('updateCoacheeEvaluation', () => {
    const updatedCoacheeEvaluation = {
      ...coacheeEvaluationMock,
      evaluation: 'update evaluation',
    };
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.update.mockResolvedValue(
        updatedCoacheeEvaluation,
      );
    });
    it('should call update and return a coacheeEvaluation updated', async () => {
      const result = await service.update(
        coacheeEvaluationMock.id,
        editCoacheeEvaluationDtoMock,
      );
      expect(CoacheeEvaluationRepositoryMock.update).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.update).toHaveBeenCalledWith(
        coacheeEvaluationMock.id,
        editCoacheeEvaluationDtoMock,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(updatedCoacheeEvaluation);
    });
  });

  describe('updateManyCoacheeEvaluation', () => {
    const updatedCoacheeEvaluations = [
      { ...coacheeEvaluationMock, evaluation: 'update evaluation' },
      { ...coacheeEvaluationMock2, evaluation: 'update evaluation' },
    ];
    const ids = [coacheeEvaluationMock.id, coacheeEvaluationMock2.id];
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.updateMany.mockResolvedValue(
        updatedCoacheeEvaluations,
      );
    });
    it('should call updateMany and return and a array of updated coachees evaluations', async () => {
      const result = await service.updateMany(
        ids,
        editCoacheeEvaluationDtoMock,
      );
      expect(CoacheeEvaluationRepositoryMock.updateMany).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.updateMany).toHaveBeenCalledWith(
        ids,
        editCoacheeEvaluationDtoMock,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(updatedCoacheeEvaluations[0]);
      expect(result[1]).toEqual(updatedCoacheeEvaluations[1]);
    });
  });

  describe('deleteCoacheeEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.delete.mockResolvedValue(
        coacheeEvaluationMock.id,
      );
    });
    it('should call delete and return the id of the coachee Evaluation deleted', async () => {
      const result = await service.delete(coacheeEvaluationMock.id);
      expect(CoacheeEvaluationRepositoryMock.delete).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.delete).toHaveBeenCalledWith(
        coacheeEvaluationMock.id,
      );
      expect(result).toBe(coacheeEvaluationMock.id);
    });
  });
});
