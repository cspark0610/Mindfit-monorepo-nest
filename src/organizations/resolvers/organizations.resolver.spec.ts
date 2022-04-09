import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsResolver } from 'src/organizations/resolvers/organizations.resolver';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { Roles } from 'src/users/enums/roles.enum';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';
import { Organization } from 'src/organizations/models/organization.model';

describe('OrganizationResolver', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let resolver: OrganizationsResolver;

  const organizationMock = {
    id: 1,
    owner: {
      id: 1,
    },
    coachees: [],
    name: 'TEST_ORGANIZATION',
    about: 'TEST_ABOUT',
    profilePicture: 'TEST_PROFILE_PICTURE',
    isActive: true,
  };
  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACHEE,
    organization: organizationMock,
    coachee: {
      id: 1,
      organization: {
        id: 1,
      },
      isAdmin: true,
    },
  };
  const organizationMock2 = { ...organizationMock, id: 2 };
  const focusAreasMock = {
    coachingAreas: {
      id: 1,
      coaches: [],
      coachees: [],
      name: 'TEST_COACHING_AREA',
      codename: 'TEST_CODENAME',
      coverPicture: 'TEST_COVER_PICTURE',
      description: 'TEST_DESCRIPTION',
    },
    value: 1,
    base: 1,
  };
  const focusAreasArrayMock = [{ ...focusAreasMock }];

  const develolpmentAreasMock = {
    strengths: ['TEAMWORK'],
    weaknesses: ['GETTING_INTO_ACTION'],
  };

  const coacheesSatisfactionMock = {
    averageSatisfaction: 1,
    sessionsSatisfaction: [
      {
        questionCodename: 'TEST_QUESTION_CODENAME',
        value: 1,
      },
    ],
  };

  const coachingSessionTimelineMock = {
    labels: ['TEST_LABEL'],
    datasets: [
      {
        label: 'TEST_LABEL',
        data: [1, 2],
      },
    ],
  };

  const OrganizationsServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createOrganization: jest.fn(),
    createManyOrganization: jest.fn(),
    update: jest.fn(),
    updateOrganization: jest.fn(),
    updateManyOrganizations: jest.fn(),
    delete: jest.fn(),
    deleteOrganization: jest.fn(),
    deleteManyOrganizations: jest.fn(),
    getOrganizationFocusAreas: jest.fn(),
    getOrganizationDevelopmentAreas: jest.fn(),
    getOrganizationCoacheesSatisfaction: jest.fn(),
    getOrganizationCoacheesCoachingSessionTimeline: jest.fn(),
  };

  const UsersServiceMock = {
    findOne: jest.fn(),
  };

  const data = {
    userId: sessionMock.userId,
    name: organizationMock.name,
    about: organizationMock.about,
  };
  const dataArray = [{ ...data }, { ...data }];
  const editOrgDtoMock = { name: 'changedName' };

  const editOrganizationsDtoMock = { isActive: false };
  const editedOrganizationsMock = [
    { ...organizationMock, id: 1, isActive: editOrganizationsDtoMock.isActive },
    { ...organizationMock, id: 2, isActive: editOrganizationsDtoMock.isActive },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsResolver,
        {
          provide: OrganizationsService,
          useValue: OrganizationsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<OrganizationsResolver>(OrganizationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllOrganizations', () => {
    beforeAll(() => {
      OrganizationsServiceMock.findAll.mockResolvedValue([organizationMock]);
    });
    it('should call findAll and return and array of coaches', async () => {
      const result = await resolver.findAll();
      expect(OrganizationsServiceMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([organizationMock]);
    });

    it('Should throw mindfit exception when a user without roles of staff o super user fetch all organizations', async () => {
      OrganizationsServiceMock.findAll.mockImplementation(() => {
        throw new MindfitException({
          error: 'Invalid User Role',
          errorCode: `USER_ROLE_UNAUTHORIZED`,
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
      try {
        await resolver.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('Invalid User Role');
        expect(error.response.errorCode).toEqual(`USER_ROLE_UNAUTHORIZED`);
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });
  describe('findUserById', () => {
    beforeAll(() => {
      OrganizationsServiceMock.findOne.mockResolvedValue(organizationMock);
    });
    it('should call findOne and return and an org by id', async () => {
      const result = await resolver.findOne(organizationMock.id);
      expect(OrganizationsServiceMock.findOne).toHaveBeenCalledWith(
        organizationMock.id,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(organizationMock);
    });
    it('Should throw mindfit exception when a user without roles of staff o super user fetch an org by id', async () => {
      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error: 'Invalid User Role',
          errorCode: `USER_ROLE_UNAUTHORIZED`,
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
      try {
        await resolver.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('Invalid User Role');
        expect(error.response.errorCode).toEqual(`USER_ROLE_UNAUTHORIZED`);
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('createOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.createOrganization.mockResolvedValue(
        organizationMock,
      );
    });
    it('should call createOrganization', async () => {
      const result = (await resolver.create(sessionMock, data)) as Organization;
      expect(OrganizationsServiceMock.createOrganization).toHaveBeenCalledWith(
        sessionMock,
        data,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(organizationMock);
    });
  });

  describe('createManyOrganizations', () => {
    beforeAll(() => {
      OrganizationsServiceMock.createManyOrganization.mockResolvedValue([
        organizationMock,
        organizationMock,
      ]);
    });
    it('should call createManyOrganizations', async () => {
      const result = (await resolver.createMany(dataArray)) as Organization[];
      expect(
        OrganizationsServiceMock.createManyOrganization,
      ).toHaveBeenCalledWith(dataArray);
      expect(result).toBeDefined();
      expect(result).toEqual([organizationMock, organizationMock]);
    });
  });

  describe('updateOrganization', () => {
    const editedOrgMock = { ...organizationMock, name: editOrgDtoMock.name };
    beforeAll(() => {
      OrganizationsServiceMock.updateOrganization.mockResolvedValue(
        editedOrgMock,
      );
    });
    it('should call updateOrganization', async () => {
      const result = (await resolver.update(
        sessionMock,
        editedOrgMock.id,
        editOrgDtoMock,
      )) as Organization;
      expect(OrganizationsServiceMock.updateOrganization).toHaveBeenCalledWith(
        sessionMock,
        editedOrgMock.id,
        editOrgDtoMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(editedOrgMock);
    });
  });

  describe('updateManyOrganizations', () => {
    beforeAll(() => {
      OrganizationsServiceMock.updateManyOrganizations.mockResolvedValue(
        editedOrganizationsMock,
      );
    });
    it('should call updateManyOrganizations', async () => {
      const result = (await resolver.updateMany(
        [organizationMock.id, organizationMock2.id],
        editOrgDtoMock,
      )) as Organization[];
      expect(
        OrganizationsServiceMock.updateManyOrganizations,
      ).toHaveBeenCalledWith(
        [organizationMock.id, organizationMock2.id],
        editOrgDtoMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(editedOrganizationsMock);
    });
  });

  describe('deleteOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.deleteOrganization.mockResolvedValue(
        organizationMock.id,
      );
    });
    it('should call delete and return the id of the org deleted', async () => {
      const result = await resolver.delete(sessionMock, organizationMock.id);
      expect(OrganizationsServiceMock.deleteOrganization).toHaveBeenCalledWith(
        sessionMock,
        organizationMock.id,
      );
      expect(result).toEqual(organizationMock.id);
    });
  });

  describe('deleteManyOrganizations', () => {
    beforeAll(() => {
      OrganizationsServiceMock.deleteManyOrganizations.mockResolvedValue([
        organizationMock.id,
        organizationMock2.id,
      ]);
    });
    it('should call deleteMany and return an array of ids of the organizations deleted', async () => {
      const result = await resolver.deleteMany(sessionMock, [
        organizationMock.id,
        organizationMock2.id,
      ]);
      expect(
        OrganizationsServiceMock.deleteManyOrganizations,
      ).toHaveBeenCalledWith(sessionMock, [
        organizationMock.id,
        organizationMock2.id,
      ]);
      expect(result).toEqual([organizationMock.id, organizationMock2.id]);
    });
  });

  describe('getOrganizationFocusAreas', () => {
    beforeAll(() => {
      OrganizationsServiceMock.getOrganizationFocusAreas.mockResolvedValue(
        focusAreasArrayMock,
      );
    });

    it('should call getOrganizationFocusAreas and return an array of focus areas', async () => {
      const result = await resolver.getOrganizationFocusAreas(sessionMock);
      expect(
        OrganizationsServiceMock.getOrganizationFocusAreas,
      ).toHaveBeenCalledWith(sessionMock.userId);
      expect(result).toEqual(focusAreasArrayMock);
    });
  });

  describe('getOrganizationDevelopmentAreas', () => {
    beforeAll(() => {
      OrganizationsServiceMock.getOrganizationDevelopmentAreas.mockResolvedValue(
        develolpmentAreasMock,
      );
    });

    it('should call getOrganizationDevelopmentAreas and return a developmentAreas', async () => {
      const result = await resolver.getOrganizationDevelopmentAreas(
        sessionMock,
      );
      expect(
        OrganizationsServiceMock.getOrganizationDevelopmentAreas,
      ).toHaveBeenCalledWith(sessionMock.userId);
      expect(result).toEqual(develolpmentAreasMock);
    });
  });

  describe('getOrganizationCoacheesSatisfaction', () => {
    beforeAll(() => {
      OrganizationsServiceMock.getOrganizationCoacheesSatisfaction.mockResolvedValue(
        coacheesSatisfactionMock,
      );
    });

    it('should call getOrganizationCoacheesSatisfaction and return a coacheesSatisfaction', async () => {
      const result = await resolver.getOrganizationCoacheesSatisfaction(
        sessionMock,
      );
      expect(
        OrganizationsServiceMock.getOrganizationCoacheesSatisfaction,
      ).toHaveBeenCalledWith(sessionMock.userId);
      expect(result).toEqual(coacheesSatisfactionMock);
    });
  });

  describe('getOrganizationCoacheesCoachingSessionTimeline', () => {
    const defaultPeriod = 'DAYS';
    beforeAll(() => {
      OrganizationsServiceMock.getOrganizationCoacheesCoachingSessionTimeline.mockResolvedValue(
        coachingSessionTimelineMock,
      );
    });

    it('should call getOrganizationCoacheesCoachingSessionTimeline and return a coachingSessionTimeline', async () => {
      const result =
        await resolver.getOrganizationCoacheesCoachingSessionTimeline(
          sessionMock,
        );
      expect(
        OrganizationsServiceMock.getOrganizationCoacheesCoachingSessionTimeline,
      ).toHaveBeenCalledWith(sessionMock.userId, defaultPeriod);
      expect(result).toEqual(coachingSessionTimelineMock);
    });
  });
});
