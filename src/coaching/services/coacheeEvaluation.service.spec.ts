import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoacheeEvaluationDto } from '../dto/coacheeEvaluation.dto';
import { CoacheeEvaluation } from '../models/coacheeEvaluation.model';
import { CoacheeEvaluationService } from './coacheeEvaluation.service';

describe('CoacheeEvaluationService', () => {
  let service: CoacheeEvaluationService;

  const coacheeEvaluationMock = {
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
    evaluation: 'TEST_EVALUATION',
  };

  const data = {
    coachId: coacheeEvaluationMock.coach.id,
    coacheeId: coacheeEvaluationMock.coachee.id,
    evaluation: coacheeEvaluationMock.evaluation,
  };

  const coacheeEvaluationRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeEvaluationService,
        {
          provide: getRepositoryToken(CoacheeEvaluation),
          useValue: coacheeEvaluationRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoacheeEvaluationService>(CoacheeEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoacheeEvaluation', () => {
    beforeAll(() => {
      jest
        .spyOn(CoacheeEvaluationDto, 'from')
        .mockResolvedValue(coacheeEvaluationMock as any);

      coacheeEvaluationRepositoryMock.save.mockResolvedValue(
        coacheeEvaluationMock,
      );
    });

    it('Should create a CoacheeEvaluation', async () => {
      const result = await service.createCoacheeEvaluation(data);

      expect(result).toEqual(coacheeEvaluationMock);
      expect(jest.spyOn(CoacheeEvaluationDto, 'from')).toHaveBeenCalledWith(
        data,
      );
      expect(coacheeEvaluationRepositoryMock.save).toHaveBeenCalledWith(
        coacheeEvaluationMock,
      );
    });
  });

  describe('editCoacheesEvaluations', () => {
    beforeAll(() => {
      coacheeEvaluationRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coacheeEvaluationMock],
        }),
      });
    });

    it('Should edit a CoacheeEvaluation', async () => {
      const result = await service.editCoacheesEvaluations(
        coacheeEvaluationMock.id,
        data,
      );

      expect(result).toEqual(coacheeEvaluationMock);
      expect(
        coacheeEvaluationRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should edit multiple CoacheeEvaluations', async () => {
      const result = await service.editCoacheesEvaluations(
        [coacheeEvaluationMock.id],
        data,
      );

      expect(result).toEqual([coacheeEvaluationMock]);
      expect(
        coacheeEvaluationRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });

  describe('getCoacheeEvaluations', () => {
    beforeAll(() => {
      coacheeEvaluationRepositoryMock.find.mockResolvedValue([
        coacheeEvaluationMock,
      ]);
    });

    it('Should return multiple CoacheeEvaluations', async () => {
      const result = await service.getCoacheeEvaluations(undefined);

      expect(result).toEqual([coacheeEvaluationMock]);
      expect(coacheeEvaluationRepositoryMock.find).toHaveBeenCalledWith(
        undefined,
      );
    });
  });

  describe('getCoacheeEvaluation', () => {
    beforeAll(() => {
      coacheeEvaluationRepositoryMock.findOne.mockResolvedValue(
        coacheeEvaluationMock,
      );
    });

    it('Should return a CoacheeEvaluation', async () => {
      const result = await service.getCoacheeEvaluation(
        coacheeEvaluationMock.id,
      );

      expect(result).toEqual(coacheeEvaluationMock);
      expect(coacheeEvaluationRepositoryMock.findOne).toHaveBeenCalledWith(
        coacheeEvaluationMock.id,
      );
    });
  });

  describe('deleteCoacheesEvaluations', () => {
    beforeAll(() => {
      coacheeEvaluationRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoacheeEvaluation', async () => {
      const result = await service.deleteCoacheesEvaluations(
        coacheeEvaluationMock.id,
      );

      expect(result).toEqual(1);
      expect(
        coacheeEvaluationRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should delete multiple CoacheeEvaluations', async () => {
      const result = await service.deleteCoacheesEvaluations([
        coacheeEvaluationMock.id,
      ]);

      expect(result).toEqual(1);
      expect(
        coacheeEvaluationRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });
});
