import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsResolver } from 'src/users/resolvers/organization.resolver';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { UsersService } from 'src/users/services/users.service';

describe('OrganizationResolver', () => {
  let resolver: OrganizationsResolver;

  // const organizationMock = {
  //   id: 1,
  //   owner: {
  //     id: 1,
  //   },
  //   coachees: [],
  //   name: 'TEST_ORGANIZATION',
  //   about: 'TEST_ABOUT',
  //   profilePicture: 'TEST_PROFILE_PICTURE',
  //   isActive: true,
  // };

  const OrganizationsServiceMock = {
    getOrganization: jest.fn(),
    getOrganizations: jest.fn(),
    createOrganization: jest.fn(),
    editOrganizations: jest.fn(),
    deleteOrganizations: jest.fn(),
  };

  const UsersServiceMock = {};

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
});
