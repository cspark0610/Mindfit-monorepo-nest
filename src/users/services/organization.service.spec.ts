import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationDto } from '../dto/organization.dto';
import { Organization } from '../models/organization.model';
import { OrganizationService } from './organization.service';

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
  };

  beforeEach(async () => {
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
      jest
        .spyOn(OrganizationDto, 'from')
        .mockResolvedValue(organizationMock as any);

      organizationRepositoryMock.save.mockResolvedValue(organizationMock);
    });

    it('Should create an Organization', async () => {
      const data = {
        about: organizationMock.about,
        name: organizationMock.name,
        ownerId: organizationMock.owner.id,
        profilePicture: organizationMock.profilePicture,
      };

      const result = await service.createOrganization(data);

      expect(result).toEqual(organizationMock);
      expect(jest.spyOn(OrganizationDto, 'from')).toHaveBeenCalledWith(data);
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

      const result = await service.editOrganizations(organizationMock.id, data);

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

      const result = await service.editOrganizations(
        [organizationMock.id],
        data,
      );

      expect(result).toEqual([organizationMock]);
      expect(organizationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getOrganizations', () => {
    beforeAll(() => {
      organizationRepositoryMock.find.mockResolvedValue([organizationMock]);
    });

    it('Should return multiple Organizations', async () => {
      const result = await service.getOrganizations(undefined);

      expect(result).toEqual([organizationMock]);
      expect(organizationRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getOrganization', () => {
    beforeAll(() => {
      organizationRepositoryMock.findOne.mockResolvedValue(organizationMock);
    });

    it('Should return an Organization', async () => {
      const result = await service.getOrganization(organizationMock.id);

      expect(result).toEqual(organizationMock);
      expect(organizationRepositoryMock.findOne).toHaveBeenCalledWith(
        organizationMock.id,
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
      const result = await service.deleteOrganizations(organizationMock.id);

      expect(result).toEqual(1);
      expect(organizationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple Organizations', async () => {
      const result = await service.deleteOrganizations([organizationMock.id]);

      expect(result).toEqual(1);
      expect(organizationRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
