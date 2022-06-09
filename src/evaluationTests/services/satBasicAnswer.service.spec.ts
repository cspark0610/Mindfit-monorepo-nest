import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatBasicAnswerRepository } from 'src/evaluationTests/repositories/satBasicAnswer.repository';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';

describe('SatBasicAnswersService', () => {
  let service: SatBasicAnswersService;

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
  const ids = [SatBasicAnswerArrayMock[0].id, SatBasicAnswerArrayMock[1].id];
  const SatBasicAnswerRepositoryMock = {
    getPositiveAnswers: jest
      .fn()
      .mockResolvedValue([SatBasicAnswerArrayMock[1]]),
    getNegativeAnswers: jest
      .fn()
      .mockResolvedValue([SatBasicAnswerArrayMock[0]]),
    getDimensionAnswers: jest
      .fn()
      .mockResolvedValue([SatBasicAnswerArrayMock[1]]),
    getAnswersByQuestionOrder: jest
      .fn()
      .mockResolvedValue(SatBasicAnswerArrayMock),
    getAnswersByIds: jest.fn().mockResolvedValue(SatBasicAnswerArrayMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicAnswersService,
        {
          provide: SatBasicAnswerRepository,
          useValue: SatBasicAnswerRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<SatBasicAnswersService>(SatBasicAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getPositiveAnswers', () => {
    it('should return an array of answers', async () => {
      const result = await service.getPositiveAnswers({ ids });
      expect(result).toEqual([SatBasicAnswerArrayMock[1]]);
    });
  });
  describe('getNegativeAnswers', () => {
    it('should return an array of answers', async () => {
      const result = await service.getNegativeAnswers({ ids });
      expect(result).toEqual([SatBasicAnswerArrayMock[0]]);
    });
  });
  describe('getDimensionAnswers', () => {
    it('should return an array of answers', async () => {
      const result = await service.getDimensionAnswers({
        dimension: AnswerDimensions.IMPROVE_TECH_SKILLS,
      });
      expect(result).toEqual([SatBasicAnswerArrayMock[1]]);
    });
  });
  describe('getAnswersByQuestionOrder', () => {
    const order = SatBasicAnswerMock.order;
    it('should return an array of answers', async () => {
      const result = await service.getAnswersByQuestionOrder({ ids, order });
      expect(result).toEqual(SatBasicAnswerArrayMock);
    });
  });
  describe('getAnswersByIds', () => {
    it('should return an array of answers', async () => {
      const result = await service.getAnswersByIds({ ids });
      expect(result).toEqual(SatBasicAnswerArrayMock);
    });
  });
});
