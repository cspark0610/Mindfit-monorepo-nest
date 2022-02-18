import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeEvaluationRepository } from 'src/coaching/repositories/coacheeEvaluation.repository';
import { CoacheeEvaluationService } from 'src/coaching/services/coacheeEvaluation.service';

describe('CoacheeEvaluationService', () => {
  let service: CoacheeEvaluationService;

  // const coacheeEvaluationMock = {
  //   id: 1,
  //   coach: {
  //     id: 1,
  //   },
  //   coachee: {
  //     id: 1,
  //   },
  //   appointmentRelated: {
  //     id: 1,
  //   },
  //   evaluation: 'TEST_EVALUATION',
  // };

  // const data = {
  //   coachId: coacheeEvaluationMock.coach.id,
  //   coacheeId: coacheeEvaluationMock.coachee.id,
  //   evaluation: coacheeEvaluationMock.evaluation,
  // };

  const CoacheeEvaluationRepositoryMock = {
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
});
