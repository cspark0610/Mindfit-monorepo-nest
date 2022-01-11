import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/services/users.service';
import { CoacheeService } from '../services/coachee.service';
import { CoacheesResolver } from './coachee.resolver';

describe('CoacheesResolver', () => {
  let resolver: CoacheesResolver;

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

  const data = {
    userId: coacheeMock.user.id,
    organizationsId: coacheeMock.organizations.map(({ id }) => id),
    coachingAreasId: coacheeMock.coachingAreas.map(({ id }) => id),
    phoneNumber: coacheeMock.phoneNumber,
    profilePicture: coacheeMock.profilePicture,
    position: coacheeMock.position,
    isAdmin: coacheeMock.isAdmin,
    canViewDashboard: coacheeMock.canViewDashboard,
    bio: coacheeMock.bio,
    aboutPosition: coacheeMock.aboutPosition,
  };
  const CoacheesServiceMock = {
    getCoachee: jest.fn(),
    getCoachees: jest.fn(),
    createCoachee: jest.fn(),
    editCoachees: jest.fn(),
    deleteCoachees: jest.fn(),
  };

  const UsersServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheesResolver,
        {
          provide: CoacheeService,
          useValue: CoacheesServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoacheesResolver>(CoacheesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.getCoachee.mockResolvedValue(coacheeMock as any);
    });

    it('Should return an Coachee', async () => {
      const result = await resolver.getCoachee(coacheeMock.id);
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.getCoachee).toHaveBeenCalledWith(
        coacheeMock.id,
      );
    });
  });

  describe('getCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.getCoachees.mockResolvedValue([coacheeMock] as any);
    });

    it('Should return an array of Coachs', async () => {
      const result = await resolver.getCoachees(undefined);
      expect(result).toEqual([coacheeMock]);
      expect(CoacheesServiceMock.getCoachees).toHaveBeenCalledWith(undefined);
    });
  });

  describe('createCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.createCoachee.mockResolvedValue(coacheeMock as any);
    });

    it('Should create an Coachee', async () => {
      const result = await resolver.createCoachee(data);
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.createCoachee).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.editCoachees.mockResolvedValue(coacheeMock as any);
    });

    it('Should edit a Coachee', async () => {
      const result = await resolver.editCoachee(coacheeMock.id, data);
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.editCoachees).toHaveBeenCalledWith(
        coacheeMock.id,
        data,
      );
    });
  });

  describe('editCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.editCoachees.mockResolvedValue([coacheeMock] as any);
    });

    it('Should edit multiple Coachees', async () => {
      const result = await resolver.editCoachees([coacheeMock.id], data);
      expect(result).toEqual([coacheeMock]);
      expect(CoacheesServiceMock.editCoachees).toHaveBeenCalledWith(
        [coacheeMock.id],
        data,
      );
    });
  });

  describe('deleteCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.deleteCoachees.mockResolvedValue(1);
    });

    it('Should delete an Coach', async () => {
      const result = await resolver.deleteCoachee(coacheeMock.id);
      expect(result).toEqual(1);
      expect(CoacheesServiceMock.deleteCoachees).toHaveBeenCalledWith(
        coacheeMock.id,
      );
    });
  });

  describe('deleteCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.deleteCoachees.mockResolvedValue(1);
    });

    it('Should delete multiple Coachs', async () => {
      const result = await resolver.deleteCoachees([coacheeMock.id]);
      expect(result).toEqual(1);
      expect(CoacheesServiceMock.deleteCoachees).toHaveBeenCalledWith([
        coacheeMock.id,
      ]);
    });
  });
});
