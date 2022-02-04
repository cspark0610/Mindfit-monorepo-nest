import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from 'src/users/resolvers/users.resolver';
import { UsersService } from 'src/users/services/users.service';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  // const userMock = {
  //   id: 1,
  //   name: 'TEST_NAME',
  //   email: 'TEST_EMAIL',
  //   password: 'TEST_PASSWORD',
  //   languages: 'TEST_LANGUAGE',
  //   isActive: true,
  //   isVerified: true,
  //   isStaff: false,
  //   isSuperUser: false,
  // };

  // const sessionMock = {
  //   userId: userMock.id,
  //   email: userMock.email,
  // };

  const UsersServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
