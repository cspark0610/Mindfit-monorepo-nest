import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsResolver } from 'src/organizations/resolvers/organizations.resolver';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { UsersService } from 'src/users/services/users.service';
import { Roles } from 'src/users/enums/roles.enum';
import * as UsersValidators from 'src/users/validators/users.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoacheeService } from 'src/coaching/services/coachee.service';

describe('OrganizationResolver', () => {
  let resolver: OrganizationsResolver;

  const coacheeMock = {
    id: 1,
    user: {
      id: 1,
    },
    //organizations: [{ id: 1 }],
    organization: { id: 1 },
    coachingAreas: [],
    coachAppointments: [],
    coachNotes: [],
    coachingSessions: [],
    coacheeEvaluations: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    profilePicture: 'TEST_PROFILE_PICTURE',
    position: 'TEST_POSITION',
    isAdmin: true,
    isActive: true,
    isSuspended: false,
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
    invited: true,
    invitationAccepted: false,
    assignedCoach: null,
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
  const editOraganizationDtoMock = {
    about: 'TEST_UPDATE_ABOUT',
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

  const suspendedCoacheeMock = {
    ...coacheeMock,
    isSuspended: true,
    isActive: false,
  };
  const activatedCoacheeMock = { ...coacheeMock };

  const OrganizationsServiceMock = {
    // getOrganization: jest.fn(),
    // getOrganizations: jest.fn(),
    // createOrganization: jest.fn(),
    // editOrganizations: jest.fn(),
    // deleteOrganizations: jest.fn(),
    update: jest.fn(),
  };

  const UsersServiceMock = {
    findOne: jest.fn(),
  };

  const CoacheeServiceMock = {
    findOne: jest.fn(),
    updateCoachee: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsResolver,
        {
          provide: OrganizationsService,
          useValue: OrganizationsServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<OrganizationsResolver>(OrganizationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('updateOrganization', () => {
    const updatedOrganizationMock = {
      ...organizationMock,
      ...editOraganizationDtoMock,
    };
    it('should return a organization updated when validations are passed successfully', async () => {
      UsersServiceMock.findOne.mockResolvedValue(sessionMock);
      const ownOrganizationSpy = jest
        .spyOn(UsersValidators, 'ownOrganization')
        .mockImplementation()
        .mockReturnValue(true);
      const isOrganizationAdminSpy = jest
        .spyOn(UsersValidators, 'isOrganizationAdmin')
        .mockImplementation()
        .mockReturnValue(true);

      OrganizationsServiceMock.update.mockResolvedValue(
        updatedOrganizationMock,
      );
      const result = await resolver.update(
        sessionMock,
        organizationMock.id,
        editOraganizationDtoMock,
      );
      expect(ownOrganizationSpy).toHaveBeenCalled();
      expect(ownOrganizationSpy).toHaveBeenCalledWith(sessionMock);
      expect(isOrganizationAdminSpy).toHaveBeenCalled();
      expect(isOrganizationAdminSpy).toHaveBeenCalledWith(sessionMock);
      expect(result).toBeDefined();
      expect(result).toEqual(updatedOrganizationMock);
    });

    it('should throw new mindfit error when user does not have an organization', async () => {
      jest
        .spyOn(UsersValidators, 'ownOrganization')
        .mockImplementation()
        .mockReturnValue(false);
      await expect(
        resolver.update(
          sessionMock,
          organizationMock.id,
          editOraganizationDtoMock,
        ),
      ).rejects.toThrow(MindfitException);
    });

    it('should throw new mindfit error when user is not the org admin', async () => {
      jest
        .spyOn(UsersValidators, 'isOrganizationAdmin')
        .mockImplementation()
        .mockReturnValue(false);
      await expect(
        resolver.update(
          sessionMock,
          organizationMock.id,
          editOraganizationDtoMock,
        ),
      ).rejects.toThrow(MindfitException);
    });
  });

  describe('suspendCoacheeByOrganization', () => {
    const suspendUpdateData = { isSuspended: true, isActive: false };
    it('should return a suspended coachee when validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoacheeServiceMock.findOne.mockResolvedValue(suspendedCoacheeMock);
      CoacheeServiceMock.updateCoachee.mockResolvedValue(suspendedCoacheeMock);

      const result = await resolver.suspendCoacheeByOrganization(
        sessionMock,
        coacheeMock.id,
      );
      expect(UsersServiceMock.findOne).toHaveBeenCalled();
      expect(CoacheeServiceMock.findOne).toHaveBeenCalled();
      expect(CoacheeServiceMock.updateCoachee).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual(suspendedCoacheeMock);
      expect(result.isSuspended).toBe(suspendUpdateData.isSuspended);
      expect(result.isActive).toBe(suspendUpdateData.isActive);
    });
  });

  describe('activateCoacheeByOrganization', () => {
    const activateUpdateData = { isSuspended: false, isActive: true };
    it('should return a activated coachee when validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoacheeServiceMock.findOne.mockResolvedValue(activatedCoacheeMock);
      CoacheeServiceMock.updateCoachee.mockResolvedValue(activatedCoacheeMock);

      const result = await resolver.suspendCoacheeByOrganization(
        sessionMock,
        coacheeMock.id,
      );
      expect(UsersServiceMock.findOne).toHaveBeenCalled();
      expect(CoacheeServiceMock.findOne).toHaveBeenCalled();
      expect(CoacheeServiceMock.updateCoachee).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual(activatedCoacheeMock);
      expect(result.isSuspended).toBe(activateUpdateData.isSuspended);
      expect(result.isActive).toBe(activateUpdateData.isActive);
    });
  });
});
