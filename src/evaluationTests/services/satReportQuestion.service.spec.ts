import { Test, TestingModule } from '@nestjs/testing';
import { SatReportQuestionsService } from 'src/evaluationTests/services/satReportQuestion.service';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatReportQuestionRepository } from 'src/evaluationTests/repositories/satReportQuestion.repository';

describe('SatReportQuestionsService', () => {
  let service: SatReportQuestionsService;

  const SatBasicSectionMock = {
    id: 1,
    title: 'title',
    codename: 'codename',
    order: 1,
  } as unknown as SatBasicSection;

  const SatSectionResultMock = {
    id: 1,
    satReport: {},
    section: SatBasicSectionMock,
    questions: [
      {
        id: 1,
        section: {},
        question: {},
        answersSelected: [],
      },
    ],
  } as SatSectionResult;

  const SatBasicQuestionMock = {
    id: 1,
    answers: null,
    section: SatBasicSectionMock,
    reportQuestions: null,
    title: 'title',
    translations: null,
    type: QuestionTypes.SELECT,
    dimension: null,
    order: 1,
  } as SatBasicQuestion;

  const SatBasicAnswerMock = {
    id: 1,
    question: SatBasicQuestionMock,
    reportQuestions: null,
    title: 'title',
    translations: null,
    value: 0.5,
    answerDimension: null,
    order: 1,
  } as SatBasicAnswer;

  const SatReportQuestionMock = {
    id: 1,
    section: SatSectionResultMock,
    question: SatBasicQuestionMock,
    answersSelected: [{ ...SatBasicAnswerMock }],
  } as SatReportQuestion;

  const SatReportQuestionArrayMock = [{ ...SatReportQuestionMock }];

  const SatReportQuestionRepositoryMock = {
    getReportQuestionsByAnswersDimention: jest
      .fn()
      .mockResolvedValue(SatReportQuestionArrayMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatReportQuestionsService,
        {
          provide: SatReportQuestionRepository,
          useValue: SatReportQuestionRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<SatReportQuestionsService>(SatReportQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReportQuestionsByAnswersDimention', () => {
    const reportIdMock = 1;
    const answerDimensionMock = ['answerDimension1', 'answerDimension2'];
    it('should return an array of SatReportQuestion', async () => {
      SatReportQuestionRepositoryMock.getReportQuestionsByAnswersDimention();
      await expect(
        service.getReportQuestionsByAnswersDimention(
          reportIdMock,
          answerDimensionMock,
        ),
      ).resolves.toEqual(SatReportQuestionArrayMock);
    });
  });
});
