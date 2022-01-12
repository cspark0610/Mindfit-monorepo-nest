import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthResolver } from './auth.resolver';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const authMock = {
    token: 'TEST_TOKEN',
    refreshToken: 'TEST_TOKEN',
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
    hashResetPassword: 'TEST_HASH',
  };

  const sessionMock = {
    userId: userMock.id,
    email: userMock.email,
    refreshToken: authMock.refreshToken,
  };

  const AuthServiceMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    logout: jest.fn(),
    requestResetPassword: jest.fn(),
    resetPassword: jest.fn(),
    refreshToken: jest.fn(),
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

    it('Should return session tokens', async () => {
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

  describe('signIn', () => {
    beforeAll(() => {
      AuthServiceMock.signIn.mockResolvedValue(authMock);
    });

    it('Should return session tokens', async () => {
      const data = {
        email: userMock.email,
        password: userMock.password,
      };
      const result = await resolver.signIn(data);
      expect(result).toEqual(authMock);
      expect(AuthServiceMock.signIn).toHaveBeenCalledWith(data);
    });
  });

  describe('refreshToken', () => {
    beforeAll(() => {
      AuthServiceMock.refreshToken.mockResolvedValue(authMock);
    });

    it('Should return session tokens', async () => {
      const result = await resolver.refreshToken(sessionMock);
      expect(result).toEqual(authMock);
      expect(AuthServiceMock.refreshToken).toHaveBeenCalledWith(
        sessionMock.userId,
        sessionMock.refreshToken,
      );
    });
  });

  describe('requestResetPassword', () => {
    beforeAll(() => {
      AuthServiceMock.requestResetPassword.mockResolvedValue(true);
    });

    it('Should request reset password', async () => {
      const result = await resolver.requestResetPassword(userMock.email);
      expect(result).toEqual(true);
      expect(AuthServiceMock.requestResetPassword).toHaveBeenCalledWith(
        userMock.email,
      );
    });
  });

  describe('resetPassword', () => {
    beforeAll(() => {
      AuthServiceMock.resetPassword.mockResolvedValue(userMock);
    });

    it('Should reset user password', async () => {
      const data = {
        email: userMock.email,
        password: userMock.password,
        confirmPassword: userMock.password,
        hash: userMock.hashResetPassword,
      };
      const result = await resolver.resetPassword(data);
      expect(result).toEqual(userMock);
      expect(AuthServiceMock.resetPassword).toHaveBeenCalledWith(data);
    });
  });

  describe('logout', () => {
    beforeAll(() => {
      AuthServiceMock.logout.mockResolvedValue(true);
    });

    it('Should return session tokens', async () => {
      const result = await resolver.logout(sessionMock);
      expect(result).toEqual(true);
      expect(AuthServiceMock.logout).toHaveBeenCalledWith(sessionMock.userId);
    });
  });
});
