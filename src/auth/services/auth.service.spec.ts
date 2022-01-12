import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

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

  const UsersServiceMock = {
    createUser: jest.fn(),
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
        .spyOn(service, 'generateToken')
        .mockImplementation()
        .mockReturnValue(authMock);

      const result = await service.signUp(data);
      expect(result).toEqual(authMock);
      expect(UsersServiceMock.createUser).toHaveBeenCalledWith(data);
      expect(jest.spyOn(service, 'generateToken')).toHaveBeenCalledWith({
        sub: userMock.id,
        username: userMock.email,
      });
    });
  });

  describe('generateToken', () => {
    beforeAll(() => {
      JwtServiceMock.sign.mockReturnValue(authMock.token);
    });

    it('Should generate a JWT token', () => {
      const payload = {
        sub: userMock.id,
        username: userMock.email,
      };

      const result = service.generateToken(payload);
      expect(result).toEqual(authMock);
      expect(JwtServiceMock.sign).toHaveBeenCalledWith(payload);
    });
  });
});
