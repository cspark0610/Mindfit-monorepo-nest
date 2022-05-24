import { Test, TestingModule } from '@nestjs/testing';
import { CoacheesResolver } from 'src/coaching/resolvers/coachee.resolver';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Roles } from 'src/users/enums/roles.enum';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { DEFAULT_COACHEE_IMAGE } from 'src/coaching/utils/coach.constants';

describe('CoacheesResolver', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let resolver: CoacheesResolver;

  // TODO Auth
  const coacheeMock = {
    id: 1,
    user: {
      id: 1,
    },
    organizations: [{ id: 1 }],
    organization: {
      id: 1,
    },
    coachingAreas: [],
    coachAppointments: [],
    coachNotes: [],
    coachingSessions: [],
    coacheeEvaluations: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    picture: DEFAULT_COACHEE_IMAGE,
    position: 'TEST_POSITION',
    isAdmin: false,
    isActive: true,
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
  };
  const coacheeMock2 = { ...coacheeMock };

  const data = {
    userId: coacheeMock.user.id,
    organizationsId: coacheeMock.organizations.map(({ id }) => id),
    coachingAreasId: coacheeMock.coachingAreas.map(({ id }) => id),
    phoneNumber: coacheeMock.phoneNumber,
    profilePicture: coacheeMock.picture,
    position: coacheeMock.position,
    isAdmin: coacheeMock.isAdmin,
    canViewDashboard: coacheeMock.canViewDashboard,
    bio: coacheeMock.bio,
    aboutPosition: coacheeMock.aboutPosition,
  };

  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACHEE,
    organization: {
      id: 1,
    },
    coachee: {
      id: 1,
      organization: {
        id: 1,
      },
      isAdmin: true,
    },
  };
  const selectCoachDtoMock = {
    coachId: 1,
    suggestedCoachId: 1,
  };
  const editCoacheeDtoMock = {
    bio: 'update bio',
  };

  const CoacheesServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createManyCoachee: jest.fn(),
    update: jest.fn(),
    updateManyCoachee: jest.fn(),
    deleteCoachee: jest.fn(),
    deleteManyCoachees: jest.fn(),
    inviteCoachee: jest.fn(),
    acceptInvitation: jest.fn(),
    selectCoach: jest.fn(),
    createCoachee: jest.fn(),
    updateCoachee: jest.fn(),
  };
  const UsersServiceMock = {
    findOne: jest.fn(),
  };

  const HistoricalAssigmentServiceMock = {};
  const coacheeQueryRelationsMock = {
    ref: 'coachee',
    relations: [['coachee', 'coachee.user']],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheesResolver,
        {
          provide: CoacheeService,
          useValue: CoacheesServiceMock,
        },
        {
          provide: HistoricalAssigmentService,
          useValue: HistoricalAssigmentServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoacheesResolver>(CoacheesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.createCoachee.mockResolvedValue(coacheeMock);
    });
    it('should create a coachee and call service.create method', async () => {
      const result = await resolver.create(data as any);
      expect(result).toBeTruthy();
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.createCoachee).toHaveBeenCalled();
    });
  });

  describe('inviteCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.inviteCoachee.mockResolvedValue(coacheeMock);
    });
    it('should return a coachee when service.inviteCoachee is called', async () => {
      const result = await resolver.inviteCoachee(sessionMock, data as any);
      expect(result).toBeTruthy();
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.inviteCoachee).toHaveBeenCalled();
    });
  });

  describe('acceptInvitation', () => {
    beforeAll(() => {
      CoacheesServiceMock.acceptInvitation.mockResolvedValue(coacheeMock);
    });
    it('should return a coachee when service.acceptInvitation is called', async () => {
      const result = await resolver.acceptInvitation(sessionMock);
      expect(result).toBeTruthy();
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.acceptInvitation).toHaveBeenCalled();
    });
  });
  describe('selectCoach', () => {
    beforeAll(() => {
      CoacheesServiceMock.selectCoach.mockResolvedValue(coacheeMock);
    });
    it('should return a coachee when service.selectCoach is called', async () => {
      const result = await resolver.selectCoach(
        sessionMock,
        selectCoachDtoMock,
      );
      expect(result).toBeTruthy();
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.selectCoach).toHaveBeenCalled();
    });
  });

  describe('findAllCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.findAll.mockResolvedValue([coacheeMock]);
    });
    it('should call findAll and return and array of coachees', async () => {
      const result = await resolver.findAll();
      expect(CoacheesServiceMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([coacheeMock]);
    });
  });

  describe('findCoacheeById', () => {
    beforeAll(() => {
      CoacheesServiceMock.findOne.mockResolvedValue(coacheeMock);
    });
    it('should call findOne and return and a coachee by id', async () => {
      const result = await resolver.findOne(
        coacheeMock.id,
        coacheeQueryRelationsMock,
      );
      expect(CoacheesServiceMock.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coacheeMock);
    });
  });

  describe('createManyCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.createManyCoachee.mockResolvedValue([
        coacheeMock,
        coacheeMock2,
      ]);
    });
    it('should call createMany and return and a array of coachs', async () => {
      const result = await resolver.createMany([data as any, data as any]);
      expect(CoacheesServiceMock.createManyCoachee).toHaveBeenCalledWith([
        data,
        data,
      ]);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toEqual(coacheeMock);
      expect(result[1]).toEqual(coacheeMock2);
    });
  });

  describe('updateCoachee', () => {
    const updatedCoachee = { ...coacheeMock, bio: 'update bio' };
    beforeAll(() => {
      CoacheesServiceMock.updateCoachee.mockResolvedValue(updatedCoachee);
    });
    it('should call update and return and coachee updated', async () => {
      UsersServiceMock.findOne.mockResolvedValue(sessionMock);
      CoacheesServiceMock.findOne.mockResolvedValue(coacheeMock);
      const result = await resolver.update(
        sessionMock,
        coacheeMock.id,
        editCoacheeDtoMock as any,
      );

      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(updatedCoachee);
    });
  });

  describe('updateManyCoachees', () => {
    const updatedCoachees = [
      { ...coacheeMock, bio: 'update bio' },
      { ...coacheeMock, bio: 'update bio' },
    ];
    const ids = [coacheeMock.id, coacheeMock2.id];
    beforeAll(() => {
      CoacheesServiceMock.updateManyCoachee.mockResolvedValue(updatedCoachees);
    });
    it('should call updateMany and return and a array of updated coachees', async () => {
      const result = await resolver.updateMany(
        sessionMock,
        ids,
        editCoacheeDtoMock,
      );
      expect(CoacheesServiceMock.updateManyCoachee).toHaveBeenCalledWith(
        sessionMock,
        ids,
        editCoacheeDtoMock,
      );
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual(updatedCoachees);
    });
  });

  describe('deleteCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.deleteCoachee.mockResolvedValue(coacheeMock.id);
    });
    it('should call delete and return the id of the coachee deleted', async () => {
      const result = await resolver.delete(sessionMock, coacheeMock.id);
      expect(CoacheesServiceMock.deleteCoachee).toHaveBeenCalledWith(
        sessionMock,
        coacheeMock.id,
      );
      expect(result).toEqual(coacheeMock.id);
    });
  });

  describe('deleteManyCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.deleteManyCoachees.mockResolvedValue([
        coacheeMock.id,
        coacheeMock2.id,
      ]);
    });
    it('should call delete and return an array of ids of the coachees deleted', async () => {
      const result = await resolver.deleteMany(sessionMock, [
        coacheeMock.id,
        coacheeMock2.id,
      ]);
      expect(CoacheesServiceMock.deleteManyCoachees).toHaveBeenCalledWith(
        sessionMock,
        [coacheeMock.id, coacheeMock2.id],
      );
      expect(result).toEqual([coacheeMock.id, coacheeMock2.id]);
    });
  });
});
