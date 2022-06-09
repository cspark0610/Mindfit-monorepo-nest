import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicAnswersResolver } from 'src/evaluationTests/resolvers/satBasicAnswer.resolver';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';

describe('SatBasicAnswersResolver', () => {
  let resolver: SatBasicAnswersResolver;

  const SatBasicSectionMock = {
    id: 1,
    satTest: [],
    questions: [],
    sectionResults: [],
    title: 'title',
    translations: null,
    codename: 'codename',
    order: 1,
  } as unknown as SatBasicSection;
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
    value: 3.5,
    answerDimension: AnswerDimensions.IMPROVE_LEADERSHIP,
    order: 1,
  } as SatBasicAnswer;
  const SatBasicAnswerArrayMock = [
    { ...SatBasicAnswerMock },
    {
      ...SatBasicAnswerMock,
      id: 2,
      value: 6.6,
      answerDimension: AnswerDimensions.IMPROVE_TECH_SKILLS,
    },
  ];

  const SatBasicAnswersServiceMock = {
    getPositiveAnswers: jest.fn().mockResolvedValue(SatBasicAnswerArrayMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicAnswersResolver,
        {
          provide: SatBasicAnswersService,
          useValue: SatBasicAnswersServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<SatBasicAnswersResolver>(SatBasicAnswersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getPositiveAnswers', () => {
    const ids = { ids: [690, 691, 698] };
    it('should return an array of answers', async () => {
      const result = await resolver.getPositiveAnswers();
      expect(result).toEqual(SatBasicAnswerArrayMock);
      expect(
        SatBasicAnswersServiceMock.getPositiveAnswers,
      ).toHaveBeenCalledWith(ids);
    });
  });
});
