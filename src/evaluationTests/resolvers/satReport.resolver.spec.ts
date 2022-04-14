import { Test, TestingModule } from '@nestjs/testing';
import { SatReportsResolver } from 'src/evaluationTests/resolvers/satReport.resolver';
import { UsersService } from 'src/users/services/users.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { Roles } from 'src/users/enums/roles.enum';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { User } from 'src/users/models/users.model';
import { SatReportDto } from 'src/evaluationTests/dto/satReport.dto';
import { SatReportQuestionDto } from 'src/evaluationTests/dto/satReportQuestion.dto';
import { SatSectionResultDto } from 'src/evaluationTests/dto/satSectionResult.dto';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';

describe('SatReportsResolver', () => {
  let resolver: SatReportsResolver;
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

  const SatReportDtoMock = {
    satRealizedId: 1,
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

  const SatReportMock = {
    id: 1,
    user: { id: 1 },
    satRealized: SatBasicMock,
    suggestedCoaches: null,
    sectionsResults: SatReportDtoMock.sectionsResult,
    result: SatResultAreaObjectTypeArrayMock,
    createdAt: now,
    updatedAt: now,
  } as unknown as SatReport;

  const coacheeMock = { id: 1 } as Coachee;
  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    coachee: coacheeMock,
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
    role: Roles.COACHEE,
  } as unknown as User;

  const sessionMock = {
    userId: 1,
    email: 'email@gmail.com',
    role: Roles.STAFF,
  };

  const SatReportsServiceMock = {
    createFullReport: jest.fn().mockResolvedValue(SatReportMock),
  };
  const UsersServiceMock = {
    findOne: jest.fn().mockResolvedValue(userMock),
  };
  const SatReportEvaluationServiceMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatReportsResolver,
        {
          provide: SatReportsService,
          useValue: SatReportsServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: SatReportEvaluationService,
          useValue: SatReportEvaluationServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<SatReportsResolver>(SatReportsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createSatReport', () => {
    it('should call createFullReport method', async () => {
      UsersServiceMock.findOne();
      SatReportsServiceMock.createFullReport();
      const result = await resolver.create(sessionMock, SatReportDtoMock);
      expect(result).toEqual(SatReportMock);
      expect(UsersServiceMock.findOne).toHaveBeenCalled();
      expect(SatReportsServiceMock.createFullReport).toHaveBeenCalled();
    });

    it('should throw mindfit exception when 1st validation is not passed', async () => {
      const user = { ...userMock, coachee: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await resolver.create(sessionMock, SatReportDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'The user does not have a profile as a coachee.',
        );
        expect(error.response.errorCode).toBe(`USER_WITHOUT_COACHEE_PROFILE`);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw mindfit exception when 2st validation is not passed', async () => {
      const user = {
        ...userMock,
        coachee: {
          id: 1,
          invited: true,
          invitationAccepted: false,
        },
      };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await resolver.create(sessionMock, SatReportDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'The user has a pending invitation as a coachee.',
        );
        expect(error.response.errorCode).toBe(`PENDING_COACHEE_INVITATION`);
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
