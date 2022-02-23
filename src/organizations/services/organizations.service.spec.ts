import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationRepository } from 'src/users/repositories/organization.repository';
import { OrganizationService } from 'src/users/services/organization.service';

describe('OrganizationService', () => {
  let service: OrganizationService;

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

  const OrganizationRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: OrganizationRepository,
          useValue: OrganizationRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrganization', () => {
    beforeAll(() => {
      OrganizationRepositoryMock.create.mockReturnValue(organizationMock);
    });

    it('Should create an Organization', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };
      const result = await service.create(data);

      expect(result).toEqual(organizationMock);
      expect(OrganizationRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('editOrganizations', () => {
    beforeAll(() => {
      OrganizationRepositoryMock.update.mockReturnValue(organizationMock);
      OrganizationRepositoryMock.updateMany.mockReturnValue([organizationMock]);
    });

    it('Should edit an Organization', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };

      const result = await service.update(organizationMock.id, data);

      expect(result).toEqual(organizationMock);
      expect(OrganizationRepositoryMock.update).toHaveBeenCalledWith(
        organizationMock.id,
        data,
      );
    });

    it('Should edit multiple Organizations', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };

      const result = await service.updateMany([organizationMock.id], data);

      expect(result).toEqual([organizationMock]);
      expect(OrganizationRepositoryMock.updateMany).toHaveBeenCalledWith(
        [organizationMock.id],
        data,
      );
    });
  });

  describe('getOrganizations', () => {
    beforeAll(() => {
      OrganizationRepositoryMock.findAll.mockResolvedValue([organizationMock]);
    });

    it('Should return multiple Organizations', async () => {
      const result = await service.findAll();

      expect(result).toEqual([organizationMock]);
      expect(OrganizationRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getOrganization', () => {
    beforeAll(() => {
      OrganizationRepositoryMock.findOneBy.mockResolvedValue(organizationMock);
    });

    it('Should return an Organization', async () => {
      const result = await service.findOne(organizationMock.id);

      expect(result).toEqual(organizationMock);
      expect(OrganizationRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: organizationMock.id,
      });
    });
  });

  describe('deleteOrganizations', () => {
    beforeAll(() => {
      OrganizationRepositoryMock.delete.mockReturnValue(1);
    });

    it('Should delete a specific Organization', async () => {
      const result = await service.delete(organizationMock.id);

      expect(result).toEqual(1);
      expect(OrganizationRepositoryMock.delete).toHaveBeenCalledWith(
        organizationMock.id,
      );
    });

    it('Should delete multiple Organizations', async () => {
      const result = await service.delete([organizationMock.id]);

      expect(result).toEqual(1);
      expect(OrganizationRepositoryMock.delete).toHaveBeenCalledWith([
        organizationMock.id,
      ]);
    });
  });
});
