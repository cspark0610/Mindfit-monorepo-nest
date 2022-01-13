import { Test, TestingModule } from '@nestjs/testing';
import { CoachService } from '../services/coach.service';
import { CoachResolver } from './coach.resolver';

describe('CoachResolver', () => {
  let resolver: CoachResolver;

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

  const CoachsServiceMock = {
    getCoach: jest.fn(),
    getCoachs: jest.fn(),
    createCoach: jest.fn(),
    editCoachs: jest.fn(),
    deleteCoachs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachResolver,
        {
          provide: CoachService,
          useValue: CoachsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoachResolver>(CoachResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.getCoach.mockResolvedValue(coachMock as any);
    });

    it('Should return an Coach', async () => {
      const result = await resolver.getCoach(coachMock.id);
      expect(result).toEqual(coachMock);
      expect(CoachsServiceMock.getCoach).toHaveBeenCalledWith(coachMock.id);
    });
  });

  describe('getCoachs', () => {
    beforeAll(() => {
      CoachsServiceMock.getCoachs.mockResolvedValue([coachMock] as any);
    });

    it('Should return an array of Coachs', async () => {
      const result = await resolver.getCoachs(undefined);
      expect(result).toEqual([coachMock]);
      expect(CoachsServiceMock.getCoachs).toHaveBeenCalledWith(undefined);
    });
  });

  describe('createCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.createCoach.mockResolvedValue(coachMock as any);
    });

    it('Should create an Coach', async () => {
      const data = {
        bio: coachMock.bio,
        userId: coachMock.user.id,
        profilePicture: coachMock.profilePicture,
        phoneNumber: coachMock.phoneNumber,
        videoPresentation: coachMock.videoPresentation,
      };

      const result = await resolver.createCoach(data);
      expect(result).toEqual(coachMock);
      expect(CoachsServiceMock.createCoach).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.editCoachs.mockResolvedValue(coachMock as any);
    });

    it('Should edit an Coach', async () => {
      const data = {
        bio: coachMock.bio,
        userId: coachMock.user.id,
        profilePicture: coachMock.profilePicture,
        phoneNumber: coachMock.phoneNumber,
        videoPresentation: coachMock.videoPresentation,
      };

      const result = await resolver.editCoach(coachMock.id, data);
      expect(result).toEqual(coachMock);
      expect(CoachsServiceMock.editCoachs).toHaveBeenCalledWith(
        coachMock.id,
        data,
      );
    });
  });

  describe('editCoachs', () => {
    beforeAll(() => {
      CoachsServiceMock.editCoachs.mockResolvedValue([coachMock] as any);
    });

    it('Should edit multiple Coachs', async () => {
      const data = {
        bio: coachMock.bio,
        userId: coachMock.user.id,
        profilePicture: coachMock.profilePicture,
        phoneNumber: coachMock.phoneNumber,
        videoPresentation: coachMock.videoPresentation,
      };

      const result = await resolver.editCoachs([coachMock.id], data);
      expect(result).toEqual([coachMock]);
      expect(CoachsServiceMock.editCoachs).toHaveBeenCalledWith(
        [coachMock.id],
        data,
      );
    });
  });

  describe('activateCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.editCoachs.mockResolvedValue({
        ...coachMock,
        isActive: true,
      } as any);
    });

    it('Should activate a Coach', async () => {
      const result = await resolver.activateCoach(coachMock.id);
      expect(result).toEqual({ ...coachMock, isActive: true });
      expect(CoachsServiceMock.editCoachs).toHaveBeenCalledWith(coachMock.id, {
        isActive: true,
      });
    });
  });

  describe('deactivateCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.editCoachs.mockResolvedValue({
        ...coachMock,
        isActive: false,
      } as any);
    });

    it('Should deactivate a Coach', async () => {
      const result = await resolver.deactivateCoach(coachMock.id);
      expect(result).toEqual({ ...coachMock, isActive: false });
      expect(CoachsServiceMock.editCoachs).toHaveBeenCalledWith(coachMock.id, {
        isActive: false,
      });
    });
  });

  describe('deleteCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.deleteCoachs.mockResolvedValue(1);
    });

    it('Should delete an Coach', async () => {
      const result = await resolver.deleteCoach(coachMock.id);
      expect(result).toEqual(1);
      expect(CoachsServiceMock.deleteCoachs).toHaveBeenCalledWith(coachMock.id);
    });
  });

  describe('deleteCoachs', () => {
    beforeAll(() => {
      CoachsServiceMock.deleteCoachs.mockResolvedValue(1);
    });

    it('Should delete multiple Coachs', async () => {
      const result = await resolver.deleteCoachs([coachMock.id]);
      expect(result).toEqual(1);
      expect(CoachsServiceMock.deleteCoachs).toHaveBeenCalledWith([
        coachMock.id,
      ]);
    });
  });
});
