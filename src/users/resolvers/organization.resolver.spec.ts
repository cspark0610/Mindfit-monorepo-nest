import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from '../services/organization.service';
import { OrganizationsResolver } from './organization.resolver';

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

  const OrganizationsServiceMock = {
    getOrganization: jest.fn(),
    getOrganizations: jest.fn(),
    createOrganization: jest.fn(),
    editOrganizations: jest.fn(),
    deleteOrganizations: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsResolver,
        {
          provide: OrganizationService,
          useValue: OrganizationsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<OrganizationsResolver>(OrganizationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.getOrganization.mockResolvedValue(
        organizationMock as any,
      );
    });

    it('Should return an Organization', async () => {
      const result = await resolver.getOrganization(organizationMock.id);
      expect(result).toEqual(organizationMock);
      expect(OrganizationsServiceMock.getOrganization).toHaveBeenCalledWith(
        organizationMock.id,
      );
    });
  });

  describe('getOrganizations', () => {
    beforeAll(() => {
      OrganizationsServiceMock.getOrganizations.mockResolvedValue([
        organizationMock,
      ] as any);
    });

    it('Should return an array of Organizations', async () => {
      const result = await resolver.getOrganizations(undefined);
      expect(result).toEqual([organizationMock]);
      expect(OrganizationsServiceMock.getOrganizations).toHaveBeenCalled();
    });
  });

  describe('createOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.createOrganization.mockResolvedValue(
        organizationMock as any,
      );
    });

    it('Should create an Organization', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };

      const result = await resolver.createOrganization(data);
      expect(result).toEqual(organizationMock);
      expect(OrganizationsServiceMock.createOrganization).toHaveBeenCalledWith(
        data,
      );
    });
  });

  describe('editOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.editOrganizations.mockResolvedValue(
        organizationMock as any,
      );
    });

    it('Should edit an Organization', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };

      const result = await resolver.editOrganization(organizationMock.id, data);
      expect(result).toEqual(organizationMock);
      expect(OrganizationsServiceMock.editOrganizations).toHaveBeenCalledWith(
        organizationMock.id,
        data,
      );
    });
  });

  describe('editOrganizations', () => {
    beforeAll(() => {
      OrganizationsServiceMock.editOrganizations.mockResolvedValue([
        organizationMock,
      ] as any);
    });

    it('Should edit multiple Organizations', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };

      const result = await resolver.editOrganizations(
        [organizationMock.id],
        data,
      );
      expect(result).toEqual([organizationMock]);
      expect(OrganizationsServiceMock.editOrganizations).toHaveBeenCalledWith(
        [organizationMock.id],
        data,
      );
    });
  });

  describe('activateOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.editOrganizations.mockResolvedValue({
        ...organizationMock,
        isActive: true,
      } as any);
    });

    it('Should activate an Organization', async () => {
      const result = await resolver.activateOrganization(organizationMock.id);
      expect(result).toEqual({ ...organizationMock, isActive: true });
      expect(OrganizationsServiceMock.editOrganizations).toHaveBeenCalledWith(
        organizationMock.id,
        { isActive: true },
      );
    });
  });

  describe('deactivateOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.editOrganizations.mockResolvedValue({
        ...organizationMock,
        isActive: false,
      } as any);
    });

    it('Should deactivate an Organization', async () => {
      const result = await resolver.deactivateOrganization(organizationMock.id);
      expect(result).toEqual({ ...organizationMock, isActive: false });
      expect(OrganizationsServiceMock.editOrganizations).toHaveBeenCalledWith(
        organizationMock.id,
        { isActive: false },
      );
    });
  });

  describe('deleteOrganization', () => {
    beforeAll(() => {
      OrganizationsServiceMock.deleteOrganizations.mockResolvedValue(1);
    });

    it('Should delete an Organization', async () => {
      const result = await resolver.deleteOrganization(organizationMock.id);
      expect(result).toEqual(1);
      expect(OrganizationsServiceMock.deleteOrganizations).toHaveBeenCalledWith(
        organizationMock.id,
      );
    });
  });

  describe('deleteOrganizations', () => {
    beforeAll(() => {
      OrganizationsServiceMock.deleteOrganizations.mockResolvedValue(1);
    });

    it('Should delete multiple Organizations', async () => {
      const result = await resolver.deleteOrganizations([organizationMock.id]);
      expect(result).toEqual(1);
      expect(OrganizationsServiceMock.deleteOrganizations).toHaveBeenCalledWith(
        organizationMock.id,
      );
    });
  });
});
