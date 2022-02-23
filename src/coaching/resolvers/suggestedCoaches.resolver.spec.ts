import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/services/users.service';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { SuggestedCoachesResolver } from 'src/coaching/resolvers/suggestedCoaches.resolver';
import { Roles } from 'src/users/enums/roles.enum';
import * as CoacheeValidator from 'src/coaching/validators/coachee.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
describe('OrganizationResolver', () => {
  let resolver: SuggestedCoachesResolver;
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
  };
  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACHEE,
  };
  const userMock = {
    id: 1,
    coachee: coacheeMock,
    coach: {},
    organization: { id: 1 },
    name: 'TEST_NAME',
    email: 'TEST_EMAIL@mail.com',
    password: '123',
    role: Roles.COACHEE,
  };
  const suggestedCoachesMock = {
    id: 1,
    coachee: { ...coacheeMock },
    coaches: [{ ...coachMock, id: 1 }],
    rejected: false,
    rejectionReason: 'TEST_REJECTION_REASON',
  };
  const rejectSuggestedCoachesDtoMock = {
    suggestedCoachesId: 1,
    rejectionReason: 'TEST_REJECTION_REASON',
  };
  const SuggestedCoachesServiceMock = {
    getRandomSuggestedCoaches: jest.fn(),
    rejectSuggestedCoaches: jest.fn(),
  };

  const UsersServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuggestedCoachesResolver,
        {
          provide: SuggestedCoachesService,
          useValue: SuggestedCoachesServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<SuggestedCoachesResolver>(SuggestedCoachesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getRandomSuggestedCoaches', () => {
    it('should return random suggested coaches', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      const haveCoacheeProfileSpy = jest
        .spyOn(CoacheeValidator, 'haveCoacheeProfile')
        .mockImplementation()
        .mockReturnValue(true);

      SuggestedCoachesServiceMock.getRandomSuggestedCoaches.mockResolvedValue(
        suggestedCoachesMock,
      );
      const result = await resolver.getRandomSuggestedCoaches(sessionMock);
      expect(haveCoacheeProfileSpy).toHaveBeenCalled();
      expect(haveCoacheeProfileSpy).toHaveBeenCalledWith(userMock);
      expect(result).toBeDefined();
      expect(result).toEqual(suggestedCoachesMock);
      expect(result.coaches).toBeInstanceOf(Array);
      expect(result.coaches.length).toBeGreaterThan(0);
    });

    it('should throw new mindfit error when user "do not have a Coachee profile"', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(CoacheeValidator, 'haveCoacheeProfile')
        .mockImplementation()
        .mockReturnValue(false);

      await expect(
        resolver.getRandomSuggestedCoaches(sessionMock),
      ).rejects.toThrow(MindfitException);
    });
  });

  describe('rejectSuggestedCoaches', () => {
    it('should return a suggestedCoaches when validation is passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      const haveCoacheeProfileSpy = jest
        .spyOn(CoacheeValidator, 'haveCoacheeProfile')
        .mockImplementation()
        .mockReturnValue(true);

      SuggestedCoachesServiceMock.rejectSuggestedCoaches.mockResolvedValue(
        suggestedCoachesMock,
      );
      const result = await resolver.rejectSuggestedCoaches(
        sessionMock,
        rejectSuggestedCoachesDtoMock,
      );
      expect(haveCoacheeProfileSpy).toHaveBeenCalled();
      expect(haveCoacheeProfileSpy).toHaveBeenCalledWith(userMock);
      expect(result).toBeDefined();
      expect(result).toEqual(suggestedCoachesMock);
      expect(result.coaches).toBeInstanceOf(Array);
      expect(result.coaches.length).toBeGreaterThan(0);
    });

    it('should throw new mindfit error when user "do not have a Coachee profile"', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(CoacheeValidator, 'haveCoacheeProfile')
        .mockImplementation()
        .mockReturnValue(false);
      await expect(
        resolver.rejectSuggestedCoaches(
          sessionMock,
          rejectSuggestedCoachesDtoMock,
        ),
      ).rejects.toThrow(MindfitException);
    });
  });
});
