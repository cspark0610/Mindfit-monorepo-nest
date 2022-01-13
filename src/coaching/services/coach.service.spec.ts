import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoachDto } from '../dto/coach.dto';
import { Coach } from '../models/coach.model';
import { CoachService } from './coach.service';

describe('CoachService', () => {
  let service: CoachService;

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

  const coachRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachService,
        {
          provide: getRepositoryToken(Coach),
          useValue: coachRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachService>(CoachService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoach', () => {
    beforeAll(() => {
      jest.spyOn(CoachDto, 'from').mockResolvedValue(coachMock as any);

      coachRepositoryMock.save.mockResolvedValue(coachMock);
    });

    it('Should create a Coach', async () => {
      const data = {
        bio: coachMock.bio,
        userId: coachMock.user.id,
        profilePicture: coachMock.profilePicture,
        phoneNumber: coachMock.phoneNumber,
        videoPresentation: coachMock.videoPresentation,
      };

      const result = await service.createCoach(data);

      expect(result).toEqual(coachMock);
      expect(jest.spyOn(CoachDto, 'from')).toHaveBeenCalledWith(data);
      expect(coachRepositoryMock.save).toHaveBeenCalledWith(coachMock);
    });
  });

  describe('editCoachs', () => {
    beforeAll(() => {
      coachRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coachMock],
        }),
      });
    });

    it('Should edit a Coach', async () => {
      const data = {
        bio: coachMock.bio,
        profilePicture: coachMock.profilePicture,
        phoneNumber: coachMock.phoneNumber,
        videoPresentation: coachMock.videoPresentation,
      };

      const result = await service.editCoachs(coachMock.id, data);

      expect(result).toEqual(coachMock);
      expect(coachRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple Coachs', async () => {
      const data = {
        bio: coachMock.bio,
        profilePicture: coachMock.profilePicture,
        phoneNumber: coachMock.phoneNumber,
        videoPresentation: coachMock.videoPresentation,
      };

      const result = await service.editCoachs([coachMock.id], data);

      expect(result).toEqual([coachMock]);
      expect(coachRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getCoachs', () => {
    beforeAll(() => {
      coachRepositoryMock.find.mockResolvedValue([coachMock]);
    });

    it('Should return multiple Coachs', async () => {
      const result = await service.getCoachs(undefined);

      expect(result).toEqual([coachMock]);
      expect(coachRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getCoach', () => {
    beforeAll(() => {
      coachRepositoryMock.findOne.mockResolvedValue(coachMock);
    });

    it('Should return a Coach', async () => {
      const result = await service.getCoach(coachMock.id);

      expect(result).toEqual(coachMock);
      expect(coachRepositoryMock.findOne).toHaveBeenCalledWith(coachMock.id);
    });
  });

  describe('deleteCoachs', () => {
    beforeAll(() => {
      coachRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific Coach', async () => {
      const result = await service.deleteCoachs(coachMock.id);

      expect(result).toEqual(1);
      expect(coachRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple Coachs', async () => {
      const result = await service.deleteCoachs([coachMock.id]);

      expect(result).toEqual(1);
      expect(coachRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
