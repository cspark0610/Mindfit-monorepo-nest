import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from 'src/users/models/organization.model';
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

  const organizationRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(Organization),
          useValue: organizationRepositoryMock,
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
      organizationRepositoryMock.save.mockResolvedValue(organizationMock);
      organizationRepositoryMock.create.mockReturnValue(organizationMock);
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
      expect(organizationRepositoryMock.create).toHaveBeenCalledWith(data);
      expect(organizationRepositoryMock.save).toHaveBeenCalledWith(
        organizationMock,
      );
    });
  });

  describe('editOrganizations', () => {
    beforeAll(() => {
      organizationRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [organizationMock],
        }),
      });
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
      expect(organizationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple Organizations', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };

      const result = await service.update([organizationMock.id], data);

      expect(result).toEqual([organizationMock]);
      expect(organizationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getOrganizations', () => {
    beforeAll(() => {
      organizationRepositoryMock.find.mockResolvedValue([organizationMock]);
    });

    it('Should return multiple Organizations', async () => {
      const result = await service.findAll();

      expect(result).toEqual([organizationMock]);
      expect(organizationRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getOrganization', () => {
    beforeAll(() => {
      organizationRepositoryMock.findOne.mockResolvedValue(organizationMock);
    });

    it('Should return an Organization', async () => {
      const result = await service.findOne(organizationMock.id);

      expect(result).toEqual(organizationMock);
      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith(
        organizationMock.id,
        undefined,
      );
    });
  });

  describe('deleteOrganizations', () => {
    beforeAll(() => {
      organizationRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific Organization', async () => {
      const result = await service.delete(organizationMock.id);

      expect(result).toEqual(1);
      expect(organizationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple Organizations', async () => {
      const result = await service.delete([organizationMock.id]);

      expect(result).toEqual(1);
      expect(organizationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
