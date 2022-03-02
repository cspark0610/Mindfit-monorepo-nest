import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/services/auth.service';
import config from 'src/config/config';
import { GoogleService } from 'src/rrss/services/google.service';
import { Roles } from 'src/users/enums/roles.enum';

describe('GoogleService', () => {
  let service: GoogleService;

  const userMock = {
    email: 'TEST_EMAIL',
    lastLoggedIn: Date.now(),
    name: 'TEST_NAME',
    role: Roles.SUPER_USER,
  };

  const googleTokenMock = 'TEST_GOOGLE_TOKEN';

  const ConfigServiceMock = {
    google: {
      clientId: 'TEST_GOOGLE_CLIENT_ID',
    },
  };

  const AuthServiceMock = {
    signUp: jest.fn(),
    rrssBaseSignIn: jest.fn(),
  };

  const authTokensMock = {
    token: 'TEST_TOKEN',
    refreshToken: 'TEST_REFRESH_TOKEN',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleService,
        {
          provide: config.KEY,
          useValue: ConfigServiceMock,
        },
        {
          provide: AuthService,
          useValue: AuthServiceMock,
        },
      ],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('Should register an User with Google', async () => {
      jest
        .spyOn(service, 'validateGoogleToken')
        .mockImplementation()
        .mockResolvedValue({
          getPayload: jest.fn().mockReturnValue({
            email: userMock.email,
            name: userMock.name,
          }),
        } as any);

      AuthServiceMock.signUp.mockResolvedValue(authTokensMock);

      const result = await service.signUp({
        token: googleTokenMock,
        role: userMock.role,
      });

      expect(result).toEqual(authTokensMock);

      expect(jest.spyOn(service, 'validateGoogleToken')).toHaveBeenCalledWith(
        googleTokenMock,
      );
      // expect(AuthServiceMock.signUp).toHaveBeenCalledWith({
      //   email: userMock.email,
      //   lastLoggedIn: new Date(userMock.lastLoggedIn),
      //   name: userMock.name,
      //   role: userMock.role,
      // });
    });
  });

  describe('signIn', () => {
    it('Should login an User with Google', async () => {
      jest
        .spyOn(service, 'validateGoogleToken')
        .mockImplementation()
        .mockResolvedValue({
          getPayload: jest.fn().mockReturnValue({
            email: userMock.email,
            name: userMock.name,
          }),
        } as any);

      AuthServiceMock.rrssBaseSignIn.mockResolvedValue(authTokensMock);

      const result = await service.signIn({
        token: googleTokenMock,
      });

      expect(result).toEqual(authTokensMock);

      expect(jest.spyOn(service, 'validateGoogleToken')).toHaveBeenCalledWith(
        googleTokenMock,
      );
      expect(AuthServiceMock.rrssBaseSignIn).toHaveBeenCalledWith(
        userMock.email,
      );
    });
  });
});
