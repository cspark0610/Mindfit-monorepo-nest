import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import config from '../../config/config';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';
import { User } from '../../users/models/users.model';
import { AwsSesService } from '../../aws/services/ses.service';

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
    hashResetPassword: 'TEST_HASH',
    verificationCode: 'TEST_CODE',
  };

  const UsersServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  const ConfigServiceMock = {
    jwt: {
      secret: 'SECRET',
      refreshSecret: 'REFRESH_SECRET',
    },
  };

  const AwsSesServiceMock = {
    sendEmail: jest.fn(),
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
          provide: AwsSesService,
          useValue: AwsSesServiceMock,
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
      UsersServiceMock.create.mockResolvedValue(userMock);
      UsersServiceMock.update.mockResolvedValue(userMock);
      AwsSesServiceMock.sendEmail.mockResolvedValue(true);
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
      expect(UsersServiceMock.create).toHaveBeenCalledWith(data);
      expect(UsersServiceMock.update).toHaveBeenCalledTimes(1);
      expect(AwsSesServiceMock.sendEmail).toHaveBeenCalledTimes(1);
      expect(jest.spyOn(service, 'generateTokens')).toHaveBeenCalledWith({
        sub: userMock.id,
        email: userMock.email,
      });
    });
  });

  describe('verifyAccount', () => {
    beforeAll(() => {
      UsersServiceMock.findOneBy.mockResolvedValue(userMock);
      UsersServiceMock.update.mockResolvedValue(userMock);
    });

    it('Should verify an User', async () => {
      const data = {
        email: userMock.email,
        code: userMock.verificationCode,
      };

      jest
        .spyOn(bcrypt, 'compareSync')
        .mockImplementation()
        .mockReturnValue(true);

      const result = await service.verifyAccount(data);
      expect(result).toEqual(true);
      expect(UsersServiceMock.findOneBy).toHaveBeenCalledWith({
        email: userMock.email,
      });
      expect(UsersServiceMock.update).toHaveBeenCalledWith(userMock.id, {
        verificationCode: null,
        isVerified: true,
      });
    });
  });

  describe('signIn', () => {
    beforeAll(() => {
      UsersServiceMock.findOneBy.mockResolvedValue(userMock);
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
      expect(UsersServiceMock.findOneBy).toHaveBeenCalledWith({
        email: data.email,
      });
      expect(jest.spyOn(service, 'generateTokens')).toHaveBeenCalledWith({
        sub: userMock.id,
        email: userMock.email,
      });
    });
  });

  describe('refreshToken', () => {
    beforeAll(() => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
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
      expect(UsersServiceMock.findOne).toHaveBeenCalledWith(userMock.id);
      expect(jest.spyOn(service, 'generateTokens')).toHaveBeenCalledWith({
        sub: userMock.id,
        email: userMock.email,
      });
    });
  });

  describe('requestResetPassword', () => {
    beforeAll(() => {
      UsersServiceMock.findOneBy.mockResolvedValue(userMock);
      UsersServiceMock.update.mockResolvedValue(userMock);
      jest
        .spyOn(bcrypt, 'hashSync')
        .mockImplementation()
        .mockReturnValue(userMock.hashResetPassword);

      AwsSesServiceMock.sendEmail.mockResolvedValue(true as any);
    });

    it('Should request user reset password hash', async () => {
      const result = await service.requestResetPassword(userMock.email);
      expect(result).toEqual(true);
      expect(UsersServiceMock.findOneBy).toHaveBeenCalledWith({
        email: userMock.email,
      });
      expect(UsersServiceMock.update).toHaveBeenCalledWith(userMock.id, {
        hashResetPassword: userMock.hashResetPassword,
      });
      expect(AwsSesServiceMock.sendEmail).toHaveBeenCalledWith({
        subject: 'Mindfit - Reset Password',
        template: `Code: ${userMock.hashResetPassword}`,
        to: [userMock.email],
      });
    });
  });

  describe('resetPassword', () => {
    beforeAll(() => {
      UsersServiceMock.findOneBy.mockResolvedValue(userMock);
      UsersServiceMock.update.mockResolvedValue(userMock);
    });

    it('Should reset user password', async () => {
      const result = await service.resetPassword({
        email: userMock.email,
        password: userMock.password,
        confirmPassword: userMock.password,
        hash: userMock.hashResetPassword,
      });
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.findOneBy).toHaveBeenCalledWith({
        email: userMock.email,
        hashResetPassword: userMock.hashResetPassword,
      });
      expect(UsersServiceMock.update).toHaveBeenCalledWith(userMock.id, {
        password: userMock.password,
        hashResetPassword: null,
      });
    });
  });

  describe('logout', () => {
    beforeAll(() => {
      UsersServiceMock.update.mockResolvedValue(userMock);
    });

    it('Should logout an User', async () => {
      const result = await service.logout(userMock.id);
      expect(result).toEqual(true);
      expect(UsersServiceMock.update).toHaveBeenCalledWith(userMock.id, {
        hashedRefreshToken: null,
      });
    });
  });

  describe('generateTokens', () => {
    beforeAll(() => {
      JwtServiceMock.sign.mockReturnValue(authMock.token);
      UsersServiceMock.update.mockResolvedValue(userMock);
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
      expect(UsersServiceMock.update).toHaveBeenCalledWith(userMock.id, {
        hashedRefreshToken: authMock.refreshToken,
      });
      expect(JwtServiceMock.sign).toHaveBeenCalledTimes(2);
    });
  });
});
