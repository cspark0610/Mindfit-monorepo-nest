import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicQuestionsResolver } from 'src/evaluationTests/resolvers/satBasicQuestion.resolver';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';

describe('SatBasicQuestionsResolver', () => {
  let resolver: SatBasicQuestionsResolver;

  const SatBasicQuestionsServiceMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicQuestionsResolver,
        {
          provide: SatBasicQuestionsService,
          useValue: SatBasicQuestionsServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<SatBasicQuestionsResolver>(SatBasicQuestionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
