import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from 'src/auth/resolvers/auth.resolver';
import { AuthService } from 'src/auth/services/auth.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  // const authMock = {
  //   token: 'TEST_TOKEN',
  //   refreshToken: 'TEST_TOKEN',
  // };

  // const userMock = {
  //   id: 1,
  //   name: 'TEST_NAME',
  //   email: 'TEST_EMAIL',
  //   languages: 'TEST_LANGUAGE',
  //   password: 'TEST_PASSWORD',
  //   isActive: true,
  //   isVerified: true,
  //   isStaff: false,
  //   isSuperUser: false,
  //   hashResetPassword: 'TEST_HASH',
  //   verificationCode: 'TEST_CODE',
  // };

  const AuthServiceMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    logout: jest.fn(),
    requestResetPassword: jest.fn(),
    resetPassword: jest.fn(),
    refreshToken: jest.fn(),
    verifyAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: AuthServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
