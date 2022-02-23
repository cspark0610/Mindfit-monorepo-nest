import { Test, TestingModule } from '@nestjs/testing';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { SuggestedCoachesRepository } from 'src/coaching/repositories/suggestedCoaches.repository';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoachService } from 'src/coaching/services/coach.service';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { Roles } from 'src/users/enums/roles.enum';
import { ConfigCodeNames } from 'src/config/enums/configCodenames.enum';
import { MindfitException } from 'src/common/exceptions/mindfitException';

describe('SuggestedCoachesService', () => {
  let service: SuggestedCoachesService;

  const coachMock = {
    id: 1,
    user: {
      id: 1,
    },
    coachApplication: {
      id: 1,
    },
    coachingAreas: [],
    bio: 'TEST_BIO',
    profilePicture: 'TEST_PROFILE_PICTURE',
    videoPresentation: 'TEST_VIDEO_PRESENTATION',
    phoneNumber: 'TEST_PHONE_NUMBER',
    isActive: true,
  };
  const coacheeMock = {
    id: 1,
    user: {
      id: 1,
    },
    organizations: [
      {
        id: 1,
      },
    ],
    coachingAreas: [],
    coachAppointments: [],
    coachNotes: [],
    coachingSessions: [],
    coacheeEvaluations: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    profilePicture: 'TEST_PROFILE_PICTURE',
    position: 'TEST_POSITION',
    isAdmin: false,
    isActive: true,
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
    invited: true,
    invitationAccepted: false,
    organization: { id: 1 },
    assignedCoach: null,
  };
  const userMock = {
    id: 1,
    coachee: coacheeMock,
    coach: coachMock,
    organization: { id: 1 },
    name: 'TEST_NAME',
    email: 'TEST_EMAIL@mail.com',
    password: '123',
    role: Roles.COACHEE,
  };
  const suggestedCoachesMock = {
    id: 1,
    coachee: { ...coacheeMock },
    coaches: [
      { ...coachMock, id: 1 },
      { ...coachMock, id: 2 },
      { ...coachMock, id: 3 },
    ],
    rejected: false,
    rejectionReason: 'TEST_REJECTION_REASON',
  };
  const satReportMock = {
    id: 1,
    user: userMock,
    satRealized: {},
    suggestedCoaches: suggestedCoachesMock,
    sectionsResult: [],
    result: [{}],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const maxSuggestionsMock = {
    id: 1,
    name: 'TEST_NAME',
    codename: ConfigCodeNames.DEFAULT_SAT,
    value: '2',
  };
  const maxCoachSuggestedMock = {
    ...maxSuggestionsMock,
    codename: ConfigCodeNames.COACH_SUGGESTED_BY_REQUEST,
  };
  const previusRejectedCoachesMock = [{ ...suggestedCoachesMock }];

  const rejectSuggestedCoachesDtoMock = {
    suggestedCoachesId: 1,
    rejectionReason: 'TEST_REJECTION_REASON',
  };

  const SuggestedCoachesRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    getLastNonRejectedSuggestion: jest.fn(),
    getAllRejectedSuggestion: jest.fn(),
  };
  const SatReportsServiceMock = {
    getLastSatReportByUser: jest.fn(),
  };

  const CoacheeServiceMock = {
    findOne: jest.fn(),
  };

  const CoachServiceMock = {
    getRandomInServiceCoaches: jest.fn(),
  };

  const CoreConfigServiceMock = {
    getMaxCoachesSuggestions: jest.fn(),
    getMaxCoachesSuggestedByRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuggestedCoachesService,
        {
          provide: SuggestedCoachesRepository,
          useValue: SuggestedCoachesRepositoryMock,
        },
        SatReportsService,
        { provide: SatReportsService, useValue: SatReportsServiceMock },
        CoacheeService,
        { provide: CoacheeService, useValue: CoacheeServiceMock },
        CoachService,
        { provide: CoachService, useValue: CoachServiceMock },
        CoreConfigService,
        { provide: CoreConfigService, useValue: CoreConfigServiceMock },
      ],
    }).compile();

    service = module.get<SuggestedCoachesService>(SuggestedCoachesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomSuggestedCoaches', () => {
    it('should return "SuggestedCoaches" // If user already has a suggestions its returned', async () => {
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);
      SatReportsServiceMock.getLastSatReportByUser.mockResolvedValue(
        satReportMock,
      );
      CoreConfigServiceMock.getMaxCoachesSuggestions.mockResolvedValue(
        maxSuggestionsMock,
      );
      CoreConfigServiceMock.getMaxCoachesSuggestedByRequest.mockResolvedValue(
        maxCoachSuggestedMock,
      );
      SuggestedCoachesRepositoryMock.getLastNonRejectedSuggestion.mockResolvedValue(
        suggestedCoachesMock,
      );
      const result = await service.getRandomSuggestedCoaches(coachMock.id);
      expect(result).toBeTruthy();
      expect(result).toMatchObject(suggestedCoachesMock);
      expect(result.coaches).toBeInstanceOf(Array);
      expect(result.coaches.length).toBe(suggestedCoachesMock.coaches.length);
    });

    it('should return "SuggestedCoaches" // If user does not have a suggestions its returned', async () => {
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);
      SatReportsServiceMock.getLastSatReportByUser.mockResolvedValue(
        satReportMock,
      );
      CoreConfigServiceMock.getMaxCoachesSuggestions.mockResolvedValue(
        maxSuggestionsMock,
      );
      CoreConfigServiceMock.getMaxCoachesSuggestedByRequest.mockResolvedValue(
        maxCoachSuggestedMock,
      );
      SuggestedCoachesRepositoryMock.getLastNonRejectedSuggestion.mockResolvedValue(
        null,
      );
      SuggestedCoachesRepositoryMock.getAllRejectedSuggestion.mockResolvedValue(
        previusRejectedCoachesMock,
      );

      const coaches = [
        { ...coachMock, id: 1 },
        { ...coachMock, id: 2 },
        { ...coachMock, id: 3 },
        { ...coachMock, id: 4 },
      ];
      CoachServiceMock.getRandomInServiceCoaches.mockResolvedValue(coaches);

      SuggestedCoachesRepositoryMock.create.mockResolvedValue({
        satReport: satReportMock,
        coachee: coacheeMock,
        coaches: coaches,
      });
      const result = await service.getRandomSuggestedCoaches(coachMock.id);
      expect(result).toBeTruthy();
      expect(result).toMatchObject({
        satReport: satReportMock,
        coachee: coacheeMock,
        coaches: coaches,
      });
      expect(result.coaches).toBeInstanceOf(Array);
      expect(result.coaches.length).toBe(coaches.length);
    });

    it('throws new midnfit error when coachee did not performes a SAT', async () => {
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);
      SatReportsServiceMock.getLastSatReportByUser.mockResolvedValue(null);

      CoreConfigServiceMock.getMaxCoachesSuggestions.mockResolvedValue(
        maxSuggestionsMock,
      );
      CoreConfigServiceMock.getMaxCoachesSuggestedByRequest.mockResolvedValue(
        maxCoachSuggestedMock,
      );

      await expect(
        service.getRandomSuggestedCoaches(coachMock.id),
      ).rejects.toThrow(MindfitException);
    });

    it('throws new midnfit error when "Max Coach Suggestions Reached"', async () => {
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);
      SatReportsServiceMock.getLastSatReportByUser.mockResolvedValue(
        satReportMock,
      );

      CoreConfigServiceMock.getMaxCoachesSuggestions.mockResolvedValue(
        maxSuggestionsMock,
      );
      CoreConfigServiceMock.getMaxCoachesSuggestedByRequest.mockResolvedValue(
        maxCoachSuggestedMock,
      );
      SuggestedCoachesRepositoryMock.getLastNonRejectedSuggestion.mockResolvedValue(
        null,
      );
      const previusRejectedCoaches = [
        { ...suggestedCoachesMock },
        { ...suggestedCoachesMock },
        { ...suggestedCoachesMock },
      ];
      SuggestedCoachesRepositoryMock.getAllRejectedSuggestion.mockResolvedValue(
        previusRejectedCoaches,
      );
      await expect(
        service.getRandomSuggestedCoaches(coachMock.id),
      ).rejects.toThrow(MindfitException);
    });

    it('throws new midnfit error when "Not enough coaches"', async () => {
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);
      SatReportsServiceMock.getLastSatReportByUser.mockResolvedValue(
        satReportMock,
      );

      CoreConfigServiceMock.getMaxCoachesSuggestions.mockResolvedValue(
        maxSuggestionsMock,
      );
      CoreConfigServiceMock.getMaxCoachesSuggestedByRequest.mockResolvedValue(
        maxCoachSuggestedMock,
      );
      SuggestedCoachesRepositoryMock.getLastNonRejectedSuggestion.mockResolvedValue(
        null,
      );
      SuggestedCoachesRepositoryMock.getAllRejectedSuggestion.mockResolvedValue(
        previusRejectedCoachesMock,
      );
      const coaches = [{ ...coachMock, id: 1 }];
      CoachServiceMock.getRandomInServiceCoaches.mockResolvedValue(coaches);
      await expect(
        service.getRandomSuggestedCoaches(coachMock.id),
      ).rejects.toThrow(MindfitException);
    });
  });

  describe('rejectSuggestedCoaches', () => {
    it('returns SuggestedCoaches when rejection is successfull when rejected is true', async () => {
      const suggestion = { ...suggestedCoachesMock, rejected: true };
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(suggestion as any);
      const result = await service.rejectSuggestedCoaches(
        rejectSuggestedCoachesDtoMock,
      );
      expect(result).toBeTruthy();
      expect(result).toMatchObject(suggestion);
      expect(result.coaches).toBeInstanceOf(Array);
      expect(result.coaches.length).toBe(suggestion.coaches.length);
    });

    it('returns SuggestedCoaches when rejection is successfull when rejected is false', async () => {
      const suggestion = { ...suggestedCoachesMock, rejected: false };
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(suggestion as any);

      const rejection = {
        ...suggestedCoachesMock,
        rejected: true,
        rejectionReason: rejectSuggestedCoachesDtoMock.rejectionReason,
      };
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(rejection as any);

      const result = await service.rejectSuggestedCoaches(
        rejectSuggestedCoachesDtoMock,
      );
      expect(result).toBeTruthy();
      expect(result).toMatchObject(rejection);
      expect(result.rejected).toBe(true);
      expect(result.rejectionReason).toBeTruthy();
    });
    it('throws new mindfit error when "Suggested Coaches does not exists."', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(null);
      await expect(
        service.rejectSuggestedCoaches(rejectSuggestedCoachesDtoMock),
      ).rejects.toThrow(MindfitException);
    });
  });
});
