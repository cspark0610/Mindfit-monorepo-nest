import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../../config/config';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';
import { User } from '../../users/models/users.model';

describe('AuthService', () => {
  let service: AuthService;

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
  };

  const UsersServiceMock = {
    createUser: jest.fn(),
    editUsers: jest.fn(),
    getUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const ConfigServiceMock = {
    jwt: {
      secret: 'SECRET',
      refreshSecret: 'REFRESH_SECRET',
    },
  };

  const JwtServiceMock = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: JwtService,
          useValue: JwtServiceMock,
        },
        {
          provide: config.KEY,
          useValue: ConfigServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    beforeAll(() => {
      UsersServiceMock.createUser.mockResolvedValue(userMock);
    });

    it('Should register an User', async () => {
      const data = {
        email: userMock.email,
        password: userMock.password,
        name: userMock.name,
      };

      jest
        .spyOn(service, 'generateTokens')
        .mockImplementation()
        .mockResolvedValue(authMock);

      const result = await service.signUp(data);
      expect(result).toEqual(authMock);
      expect(UsersServiceMock.createUser).toHaveBeenCalledWith(data);
      expect(jest.spyOn(service, 'generateTokens')).toHaveBeenCalledWith({
        sub: userMock.id,
        email: userMock.email,
      });
    });
  });

  describe('signIn', () => {
    beforeAll(() => {
      UsersServiceMock.getUserByEmail.mockResolvedValue(userMock);
    });

    it('Should login an User', async () => {
      const data = {
        email: userMock.email,
        password: userMock.password,
      };

      jest
        .spyOn(service, 'generateTokens')
        .mockImplementation()
        .mockResolvedValue(authMock);

      jest
        .spyOn(User, 'verifyPassword')
        .mockImplementation()
        .mockReturnValue(true);

      const result = await service.signIn(data);
      expect(result).toEqual(authMock);
      expect(UsersServiceMock.getUserByEmail).toHaveBeenCalledWith(data.email);
      expect(jest.spyOn(service, 'generateTokens')).toHaveBeenCalledWith({
        sub: userMock.id,
        email: userMock.email,
      });
    });
  });

  describe('refreshToken', () => {
    beforeAll(() => {
      UsersServiceMock.getUser.mockResolvedValue(userMock);
    });

    it('Should refresh tokens', async () => {
      jest
        .spyOn(service, 'generateTokens')
        .mockImplementation()
        .mockResolvedValue(authMock);

      jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation()
        .mockReturnValue(true);

      const result = await service.refreshToken(
        userMock.id,
        authMock.refreshToken,
      );
      expect(result).toEqual(authMock);
      expect(UsersServiceMock.getUser).toHaveBeenCalledWith(userMock.id);
      expect(jest.spyOn(service, 'generateTokens')).toHaveBeenCalledWith({
        sub: userMock.id,
        email: userMock.email,
      });
    });
  });

  describe('logout', () => {
    beforeAll(() => {
      UsersServiceMock.editUsers.mockResolvedValue(userMock);
    });

    it('Should logout an User', async () => {
      const result = await service.logout(userMock.id);
      expect(result).toEqual(true);
      expect(UsersServiceMock.editUsers).toHaveBeenCalledWith(userMock.id, {
        hashedRefreshToken: null,
      });
    });
  });

  describe('generateTokens', () => {
    beforeAll(() => {
      JwtServiceMock.sign.mockReturnValue(authMock.token);
      UsersServiceMock.editUsers.mockResolvedValue(userMock);
      jest
        .spyOn(bcrypt, 'hashSync')
        .mockImplementation()
        .mockReturnValue(authMock.refreshToken);
    });

    it('Should generate a JWT token and refreshToken', async () => {
      const payload = {
        sub: userMock.id,
        email: userMock.email,
      };

      const result = await service.generateTokens(payload);
      expect(result).toEqual(authMock);
      expect(UsersServiceMock.editUsers).toHaveBeenCalledWith(userMock.id, {
        hashedRefreshToken: authMock.refreshToken,
      });
      expect(JwtServiceMock.sign).toHaveBeenCalledTimes(2);
    });
  });
});
