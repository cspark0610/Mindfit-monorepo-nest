import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { SatBasicRepository } from 'src/evaluationTests/repositories/satBasic.repository';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { NestedSatBasicQuestionDto } from 'src/evaluationTests/dto/satBasicQuestion.dto';
import { NestedSatBasicSectionDto } from 'src/evaluationTests/dto/satBasicSection.dto';
import { SatBasicDto } from 'src/evaluationTests/dto/satBasic.dto';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';
import { NestedSatBasicAnswerDto } from 'src/evaluationTests/dto/satBasicAnswer.dto';

describe('SatBasicService', () => {
  let service: SatBasicService;
  const now = new Date();

  const SatBasicMock = {
    id: 1,
    sections: null,
    testsReports: null,
    title: 'title',
    translations: null,
    description: 'description',
    createdAt: now,
    updatedAt: now,
  } as SatBasic;

  const SatBasicSectionMock = {
    id: 1,
    title: 'title',
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
    value: 0.5,
    answerDimension: null,
    order: 1,
  } as SatBasicAnswer;

  const SatBasicDtoMock = {
    title: 'title',
    description: 'description',
    satBasicSections: [
      {
        title: 'title',
        translations: null,
        questions: [
          {
            title: 'title',
            translations: null,
            satBasicAnswers: [
              {
                title: 'title',
                translations: null,
                answerDimension: AnswerDimensions.IMPROVE_COMMUNICATION_SKILLS,
                value: 1,
                order: 1,
              } as NestedSatBasicAnswerDto,
            ],
            order: 1,
            dimension: QuestionDimentions.GENERAL,
          } as NestedSatBasicQuestionDto,
        ],
        order: 1,
        codename: SectionCodenames.GENERAL,
      } as NestedSatBasicSectionDto,
    ],
  } as SatBasicDto;

  const SatBasicRepositoryMock = {
    findOneBy: jest.fn().mockResolvedValue(SatBasicMock),
  };
  const SatBasicSectionsServiceMock = {
    create: jest.fn().mockResolvedValue(SatBasicSectionMock),
  };
  const SatBasicQuestionsServiceMock = {
    create: jest.fn().mockResolvedValue(SatBasicQuestionMock),
  };
  const SatBasicAnswersServiceMock = {
    create: jest.fn().mockResolvedValue(SatBasicAnswerMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicService,
        {
          provide: SatBasicRepository,
          useValue: SatBasicRepositoryMock,
        },
        {
          provide: SatBasicSectionsService,
          useValue: SatBasicSectionsServiceMock,
        },
        {
          provide: SatBasicQuestionsService,
          useValue: SatBasicQuestionsServiceMock,
        },
        {
          provide: SatBasicAnswersService,
          useValue: SatBasicAnswersServiceMock,
        },
      ],
    }).compile();
    service = module.get<SatBasicService>(SatBasicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFullTest', () => {
    it('should return a satBasic', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(SatBasicMock);
      SatBasicSectionsServiceMock.create();
      SatBasicQuestionsServiceMock.create();
      SatBasicAnswersServiceMock.create();
      SatBasicRepositoryMock.findOneBy();

      const result = await service.createFullTest(SatBasicDtoMock);
      expect(result).toEqual(SatBasicMock);
      expect(SatBasicSectionsServiceMock.create).toHaveBeenCalled();
      expect(SatBasicQuestionsServiceMock.create).toHaveBeenCalled();
      expect(SatBasicAnswersServiceMock.create).toHaveBeenCalled();
      expect(SatBasicRepositoryMock.findOneBy).toHaveBeenCalled();
    });
  });
});
