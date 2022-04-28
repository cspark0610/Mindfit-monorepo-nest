import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';
import { SatBasicQuestionRepository } from 'src/evaluationTests/repositories/satBasicQuestion.repository';

describe('SatBasicQuestionsService', () => {
  let service: SatBasicQuestionsService;

  const SatBasicQuestionRepositoryMock = {};
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicQuestionsService,
        {
          provide: SatBasicQuestionRepository,
          useValue: SatBasicQuestionRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<SatBasicQuestionsService>(SatBasicQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
