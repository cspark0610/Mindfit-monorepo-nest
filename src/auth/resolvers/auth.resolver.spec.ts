import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthResolver } from './auth.resolver';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const authMock = {
    token: 'TEST_TOKEN',
  };

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
  };

  const AuthServiceMock = {
    signUp: jest.fn(),
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

  describe('signUp', () => {
    beforeAll(() => {
      AuthServiceMock.signUp.mockResolvedValue(authMock);
    });

    it('Should return an array of User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: userMock.password,
      };
      const result = await resolver.signUp(data);
      expect(result).toEqual(authMock);
      expect(AuthServiceMock.signUp).toHaveBeenCalledWith(data);
    });
  });
});
