import { Test, TestingModule } from '@nestjs/testing';
import { CoacheesResolver } from 'src/coaching/resolvers/coachee.resolver';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoacheeDto } from 'src/coaching/dto/coachee.dto';
import { Roles } from 'src/users/enums/roles.enum';
describe('CoacheesResolver', () => {
  let resolver: CoacheesResolver;
  // TODO Auth
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
  const coacheeMock2 = { ...coacheeMock };

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

  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACHEE,
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
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    inviteCoachee: jest.fn(),
    acceptInvitation: jest.fn(),
    selectCoach: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheesResolver,
        {
          provide: CoacheeService,
          useValue: CoacheesServiceMock,
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
      CoacheesServiceMock.create.mockResolvedValue(coacheeMock);
    });
    it('should create a coachee and call service.create method', async () => {
      const fromSpy = jest
        .spyOn(CoacheeDto, 'from')
        .mockImplementation()
        .mockResolvedValue(coacheeMock as any);
      const result = await resolver.create(data as any);

      expect(result).toBeTruthy();
      expect(result).toEqual(coacheeMock);
      expect(CoacheesServiceMock.create).toHaveBeenCalled();
      expect(fromSpy).toHaveBeenCalledWith(data);
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
  //falta registrationStatus

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
      const result = await resolver.findOne(coacheeMock.id);
      expect(CoacheesServiceMock.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coacheeMock);
    });
  });

  describe('createManyCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.createMany.mockResolvedValue([
        coacheeMock,
        coacheeMock2,
      ]);
    });
    it('should call createMany and return and a array of coachs', async () => {
      const result = await resolver.createMany([data, data]);
      expect(CoacheesServiceMock.createMany).toHaveBeenCalled();
      expect(CoacheesServiceMock.createMany).toHaveBeenCalledWith([data, data]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(coacheeMock);
      expect(result[1]).toEqual(coacheeMock2);
    });
  });

  describe('updateCoachee', () => {
    const updatedCoachee = { ...coacheeMock, bio: 'update bio' };
    beforeAll(() => {
      CoacheesServiceMock.update.mockResolvedValue(updatedCoachee);
    });
    it('should call update and return and coachee updated', async () => {
      const result = await resolver.update(coacheeMock.id, editCoacheeDtoMock);
      expect(CoacheesServiceMock.update).toHaveBeenCalled();
      expect(CoacheesServiceMock.update).toHaveBeenCalledWith(
        coacheeMock.id,
        editCoacheeDtoMock,
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
      CoacheesServiceMock.updateMany.mockResolvedValue(updatedCoachees);
    });
    it('should call updateMany and return and a array of updated coachees', async () => {
      const result = await resolver.updateMany(editCoacheeDtoMock, ids);
      expect(CoacheesServiceMock.updateMany).toHaveBeenCalled();
      expect(CoacheesServiceMock.updateMany).toHaveBeenCalledWith(
        editCoacheeDtoMock,
        ids,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(updatedCoachees[0]);
      expect(result[1]).toEqual(updatedCoachees[1]);
    });
  });

  describe('deleteCoachee', () => {
    beforeAll(() => {
      CoacheesServiceMock.delete.mockResolvedValue(coacheeMock.id);
    });
    it('should call delete and return the id of the coachee deleted', async () => {
      const result = await resolver.delete(coacheeMock.id);
      expect(CoacheesServiceMock.delete).toHaveBeenCalled();
      expect(CoacheesServiceMock.delete).toHaveBeenCalledWith(coacheeMock.id);
      expect(result).toBe(coacheeMock.id);
    });
  });

  describe('deleteManyCoachees', () => {
    beforeAll(() => {
      CoacheesServiceMock.delete.mockResolvedValue([
        coacheeMock.id,
        coacheeMock2.id,
      ]);
    });
    it('should call delete and return an array of ids of the coachees deleted', async () => {
      const result = await resolver.deleteMany([
        coacheeMock.id,
        coacheeMock2.id,
      ]);

      expect(CoacheesServiceMock.delete).toHaveBeenCalled();
      expect(CoacheesServiceMock.delete).toHaveBeenCalledWith([
        coacheeMock.id,
        coacheeMock2.id,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBe(coacheeMock.id);
      expect(result[1]).toBe(coacheeMock2.id);
    });
  });
});
