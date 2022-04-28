import { Test, TestingModule } from '@nestjs/testing';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportRepository } from 'src/evaluationTests/repositories/satReport.repository';
import { SatReportQuestionsService } from 'src/evaluationTests/services/satReportQuestion.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatBasicQuestionsService } from 'src/evaluationTests/services/satBasicQuestion.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { User } from 'src/users/models/users.model';
import { SatReportDto } from 'src/evaluationTests/dto/satReport.dto';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { SatSectionResultDto } from 'src/evaluationTests/dto/satSectionResult.dto';
import { SatReportQuestionDto } from 'src/evaluationTests/dto/satReportQuestion.dto';
import { Coachee } from 'src/coaching/models/coachee.model';

describe('SatReportsService', () => {
  let service: SatReportsService;
  const now = new Date();

  const SatResultAreaObjectTypeMock = {
    area: 'area',
    areaCodeName: 'areaCodeName',
    puntuations: [],
    diagnostics: [],
  } as SatResultAreaObjectType;
  const SatResultAreaObjectTypeArrayMock = [
    {
      ...SatResultAreaObjectTypeMock,
    },
  ];
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
  const SatSectionResultMock = {
    id: 1,
    satReport: {},
    section: null,
    questions: [
      {
        id: 1,
        section: {},
        question: {},
        answersSelected: [],
      },
    ],
  } as SatSectionResult;
  const SatReportMock = {
    id: 1,
    user: { id: 1 },
    satRealized: SatBasicMock,
    suggestedCoaches: null,
    sectionsResults: [{ ...SatSectionResultMock }],
    result: SatResultAreaObjectTypeArrayMock,
    createdAt: now,
    updatedAt: now,
  } as SatReport;
  const SatReportArrayMock = [{ ...SatReportMock }];

  const SatReportDtoMock = {
    satRealizedId: SatReportMock.id,
    sectionsResult: [
      {
        section: 1,
        questions: [
          {
            question: 1,
            answersSelected: [1],
          } as SatReportQuestionDto,
        ],
      } as SatSectionResultDto,
    ],
  } as SatReportDto;
  const userMock = { id: 1 } as User;
  const coacheeMock = { id: 1 } as Coachee;

  const SatBasicSectionMock = {
    id: 1,
    satTest: SatBasicMock,
    questions: [],
    sectionResults: [SatSectionResultMock],
    title: 'title',
    translations: null,
    codename: SectionCodenames.HAPPINESS,
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

  const SatReportQuestionMock = {
    id: 1,
    section: SatSectionResultMock,
    question: SatBasicQuestionMock,
    answersSelected: [SatBasicAnswerMock],
  } as SatReportQuestion;

  const SatReportRepositoryMock = {
    getLastSatReportByUser: jest.fn().mockResolvedValue(SatReportMock),
    getLastSatReportByCoachee: jest.fn().mockResolvedValue(SatReportMock),
    getSatReportByCoacheeIdAndDateRange: jest
      .fn()
      .mockResolvedValue(SatReportArrayMock),
  };
  const SatReportQuestionsServiceMock = {
    create: jest.fn().mockResolvedValue(SatReportQuestionMock),
  };
  const SatSectionResultsServiceMock = {
    create: jest.fn().mockResolvedValue(SatSectionResultMock),
  };
  const SatBasicServiceMock = {
    findOne: jest.fn().mockResolvedValue(SatBasicMock),
  };
  const SatBasicSectionsServiceMock = {
    findOne: jest.fn().mockResolvedValue(SatBasicSectionMock),
  };
  const SatBasicAnswersServiceMock = {
    getAnswersByIds: jest.fn().mockResolvedValue([SatBasicAnswerMock]),
  };
  const SatBasicQuestionsServiceMock = {
    findOne: jest.fn().mockResolvedValue(SatBasicQuestionMock),
  };
  const SatReportEvaluationServiceMock = {
    getSatResult: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatReportsService,
        {
          provide: SatReportRepository,
          useValue: SatReportRepositoryMock,
        },
        {
          provide: SatReportQuestionsService,
          useValue: SatReportQuestionsServiceMock,
        },
        {
          provide: SatSectionResultsService,
          useValue: SatSectionResultsServiceMock,
        },
        {
          provide: SatBasicService,
          useValue: SatBasicServiceMock,
        },
        {
          provide: SatBasicSectionsService,
          useValue: SatBasicSectionsServiceMock,
        },
        {
          provide: SatBasicAnswersService,
          useValue: SatBasicAnswersServiceMock,
        },
        {
          provide: SatBasicQuestionsService,
          useValue: SatBasicQuestionsServiceMock,
        },
        {
          provide: SatReportEvaluationService,
          useValue: SatReportEvaluationServiceMock,
        },
      ],
    }).compile();
    service = module.get<SatReportsService>(SatReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFullReport', () => {
    it('should call SatReportService.create and // Update the report with the calculation of results', async () => {
      SatBasicServiceMock.findOne();
      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(SatReportMock);

      SatBasicSectionsServiceMock.findOne();
      SatSectionResultsServiceMock.create();
      //
      SatBasicQuestionsServiceMock.findOne();
      SatBasicAnswersServiceMock.getAnswersByIds();
      SatReportQuestionsServiceMock.create();
      //
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(SatReportMock);

      SatReportEvaluationServiceMock.getSatResult();
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(SatReportMock);

      const result = await service.createFullReport(userMock, SatReportDtoMock);

      expect(result).toEqual(SatReportMock);
      expect(SatBasicServiceMock.findOne).toHaveBeenCalled();
      expect(SatBasicSectionsServiceMock.findOne).toHaveBeenCalled();
      expect(SatSectionResultsServiceMock.create).toHaveBeenCalled();
      expect(SatBasicQuestionsServiceMock.findOne).toHaveBeenCalled();
      expect(SatBasicAnswersServiceMock.getAnswersByIds).toHaveBeenCalled();
      expect(SatReportQuestionsServiceMock.create).toHaveBeenCalled();
      expect(SatReportEvaluationServiceMock.getSatResult).toHaveBeenCalled();
    });
  });

  describe('getLastSatReportByUser', () => {
    it('should call getLastSatReportByUser and return a satReport', async () => {
      const result = await service.getLastSatReportByUser(userMock.id);
      expect(result).toEqual(SatReportMock);
      expect(SatReportRepositoryMock.getLastSatReportByUser).toHaveBeenCalled();
    });
  });

  describe('getLastSatReportByCoachee', () => {
    it('should call getLastSatReportByCoachee and return a satReport', async () => {
      const result = await service.getLastSatReportByCoachee(coacheeMock.id);
      expect(result).toEqual(SatReportMock);
      expect(
        SatReportRepositoryMock.getLastSatReportByCoachee,
      ).toHaveBeenCalled();
    });
  });

  describe('getSatReportByCoacheeIdAndDateRange', () => {
    it('should call getSatReportByCoacheeIdAndDateRange and return an array of satReport', async () => {
      const result = await service.getSatReportByCoacheeIdAndDateRange(
        coacheeMock.id,
        now,
        now,
      );
      expect(result).toEqual(SatReportArrayMock);
      expect(
        SatReportRepositoryMock.getSatReportByCoacheeIdAndDateRange,
      ).toHaveBeenCalled();
    });
  });
});
