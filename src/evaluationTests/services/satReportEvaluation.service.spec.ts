import { Test, TestingModule } from '@nestjs/testing';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { SubordinateEvaluationService } from 'src/evaluationTests/services/evaluation/subordinateEvaluation.service';
import { LeadershipEvaluationService } from 'src/evaluationTests/services/evaluation/leadershipEvaluation.service';
import { EmotionalStateEvaluationService } from 'src/evaluationTests/services/evaluation/emotionalStateEvaluation.service';
import { LifePurposeEvaluationService } from 'src/evaluationTests/services/evaluation/lifePurposeEvaluation.service';
import { HappinessEvaluationService } from 'src/evaluationTests/services/evaluation/happinessEvaluation.service';
import { HealtEvaluationService } from 'src/evaluationTests/services/evaluation/healtEvaluation.service';
import { SatReportQuestionsService } from 'src/evaluationTests/services/satReportQuestion.service';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { TeamWorkEvaluationService } from 'src/evaluationTests/services/evaluation/teamworkEvaluation.service';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { DimensionAverages } from 'src/evaluationTests/models/dimensionAverages.model';
import { DevelopmentAreas } from 'src/coaching/models/dashboardStatistics/developmentAreas.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { QuestionTypes } from 'src/evaluationTests/enums/questionTypes.enum';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatBasicQuestion } from 'src/evaluationTests/models/satBasicQuestion.model';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { Coachee } from 'src/coaching/models/coachee.model';

describe('SatReportEvaluationService', () => {
  let service: SatReportEvaluationService;
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

  const DimensionAveragesMock = {
    dimension: SectionCodenames.GENERAL,
    average: 0,
    base: 1,
  } as DimensionAverages;
  const DimensionAveragesArrayMock = [{ ...DimensionAveragesMock }];

  const DevelopmentAreasMock = {
    strengths: [SectionCodenames.GENERAL],
    weaknesses: [SectionCodenames.GENERAL],
  } as DevelopmentAreas;

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

  const SatReportQuestionMock = {
    id: 1,
    section: SatSectionResultMock,
    question: SatBasicQuestionMock,
    answersSelected: [{ ...SatBasicAnswerMock }],
  } as SatReportQuestion;

  const SatReportQuestionArrayMock = [{ ...SatReportQuestionMock }];

  const CoachingAreaMock = {
    id: 1,
    coaches: [],
    coachees: [],
    name: 'name',
    codename: 'codename',
    coverPicture: 'coverPicture',
    description: 'description',
  };
  const CoachingAreaArrayMock = [{ ...CoachingAreaMock }];
  const CoacheeMock = { id: 1 } as Coachee;

  const SubordinateEvaluationServiceMock = {
    getEvaluation: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };
  const LeadershipEvaluationServiceMock = {
    getEvaluation: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };
  const EmotionalStateEvaluationServiceMock = {
    getEvaluation: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };
  const LifePurposeEvaluationServiceMock = {
    getEvaluation: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };
  const HappinessEvaluationServiceMock = {
    getEvaluation: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };
  const TeamWorkEvaluationServiceMock = {
    getEvaluation: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };
  const HealtEvaluationServiceMock = {
    getEvaluation: jest.fn().mockResolvedValue(SatResultAreaObjectTypeMock),
  };
  const SatReportQuestionsServiceMock = {
    getReportQuestionsByAnswersDimention: jest
      .fn()
      .mockResolvedValue(SatReportQuestionArrayMock),
  };
  const CoachingAreaServiceMock = {
    getManyCochingAreaByCodenames: jest
      .fn()
      .mockResolvedValue(CoachingAreaArrayMock),
  };
  const SatReportsServiceMock = {
    findOne: jest.fn().mockResolvedValue(SatReportMock),
  };

  const CoacheeServiceMock = {
    assignCoachingAreas: jest.fn().mockResolvedValue(CoacheeMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatReportEvaluationService,
        {
          provide: SubordinateEvaluationService,
          useValue: SubordinateEvaluationServiceMock,
        },
        {
          provide: LeadershipEvaluationService,
          useValue: LeadershipEvaluationServiceMock,
        },
        {
          provide: EmotionalStateEvaluationService,
          useValue: EmotionalStateEvaluationServiceMock,
        },
        {
          provide: LifePurposeEvaluationService,
          useValue: LifePurposeEvaluationServiceMock,
        },
        {
          provide: HappinessEvaluationService,
          useValue: HappinessEvaluationServiceMock,
        },
        {
          provide: TeamWorkEvaluationService,
          useValue: TeamWorkEvaluationServiceMock,
        },
        {
          provide: HealtEvaluationService,
          useValue: HealtEvaluationServiceMock,
        },
        {
          provide: SatReportQuestionsService,
          useValue: SatReportQuestionsServiceMock,
        },
        {
          provide: CoachingAreaService,
          useValue: CoachingAreaServiceMock,
        },
        {
          provide: SatReportsService,
          useValue: SatReportsServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();
    service = module.get<SatReportEvaluationService>(
      SatReportEvaluationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSatResult', () => {
    const satReportIdMock = 1;
    it('should return an array of SatResultAreaObjectType', async () => {
      SubordinateEvaluationServiceMock.getEvaluation();
      LeadershipEvaluationServiceMock.getEvaluation();
      EmotionalStateEvaluationServiceMock.getEvaluation();
      LifePurposeEvaluationServiceMock.getEvaluation();
      HappinessEvaluationServiceMock.getEvaluation();
      HealtEvaluationServiceMock.getEvaluation();

      jest.spyOn(service, 'assignCoacheeCoachingAreas').mockImplementation();
      jest
        .spyOn(service, 'getSatResult')
        .mockImplementation()
        .mockResolvedValue(SatResultAreaObjectTypeArrayMock);

      const result = await service.getSatResult(satReportIdMock);
      expect(result).toEqual(SatResultAreaObjectTypeArrayMock);
    });
  });

  describe('getWeakAndStrongDimensionsBySatReports', () => {
    it('should return an development areas', async () => {
      jest
        .spyOn(service, 'getDimensionAveragesBySatReports')
        .mockImplementation()
        .mockReturnValue(DimensionAveragesArrayMock);

      jest
        .spyOn(service, 'getWeakAndStrongDimensionsBySatReports')
        .mockImplementation()
        .mockResolvedValue(DevelopmentAreasMock);

      const result = await service.getWeakAndStrongDimensionsBySatReports(
        SatReportArrayMock,
      );
      expect(result).toEqual(DevelopmentAreasMock);
    });
  });

  describe('assignCoacheeCoachingAreas', () => {
    it('should assign to a Coachee the coaching areas to work into', async () => {
      SatReportQuestionsServiceMock.getReportQuestionsByAnswersDimention();

      jest
        .spyOn(service, 'getAreasByAnswersSelected')
        .mockImplementation()
        .mockResolvedValue(['EMOTIONAL_INTELLIGENCE'] as never);

      CoachingAreaServiceMock.getManyCochingAreaByCodenames();
      CoacheeServiceMock.assignCoachingAreas();

      const result = await service.assignCoacheeCoachingAreas(SatReportMock.id);
      expect(result).toBeUndefined();
      expect(
        SatReportQuestionsServiceMock.getReportQuestionsByAnswersDimention,
      ).toHaveBeenCalled();
      expect(
        CoachingAreaServiceMock.getManyCochingAreaByCodenames,
      ).toHaveBeenCalled();
      expect(CoacheeServiceMock.assignCoachingAreas).toHaveBeenCalled();
    });
  });
});
