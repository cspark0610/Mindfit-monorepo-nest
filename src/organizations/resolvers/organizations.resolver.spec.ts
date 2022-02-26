import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsResolver } from 'src/organizations/resolvers/organizations.resolver';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { UsersService } from 'src/users/services/users.service';
import { Roles } from 'src/users/enums/roles.enum';
import * as UsersValidators from 'src/users/validators/users.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';

describe('OrganizationResolver', () => {
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

  const OrganizationsServiceMock = {
    update: jest.fn(),
  };

  const UsersServiceMock = {
    findOne: jest.fn(),
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
});
