import { Test, TestingModule } from '@nestjs/testing';
import config from '../../config/config';
import { GoogleService } from './google.service';
import { AuthService } from '../../auth/services/auth.service';

describe('GoogleService', () => {
  let service: GoogleService;

  const userDataMock = {
    email: 'TEST_EMAIL',
    name: 'TEST_NAME',
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
            email: userDataMock.email,
            name: userDataMock.name,
          }),
        } as any);

      AuthServiceMock.signUp.mockResolvedValue(authTokensMock);

      const result = await service.signUp({ token: googleTokenMock });

      expect(result).toEqual(authTokensMock);

      expect(jest.spyOn(service, 'validateGoogleToken')).toHaveBeenCalledWith(
        googleTokenMock,
      );
      expect(AuthServiceMock.signUp).toHaveBeenCalledWith({
        email: userDataMock.email,
        name: userDataMock.name,
      });
    });
  });

  describe('signIn', () => {
    it('Should register an User with Google', async () => {
      jest
        .spyOn(service, 'validateGoogleToken')
        .mockImplementation()
        .mockResolvedValue({
          getPayload: jest.fn().mockReturnValue({
            email: userDataMock.email,
            name: userDataMock.name,
          }),
        } as any);

      AuthServiceMock.rrssBaseSignIn.mockResolvedValue(authTokensMock);

      const result = await service.signIn({ token: googleTokenMock });

      expect(result).toEqual(authTokensMock);

      expect(jest.spyOn(service, 'validateGoogleToken')).toHaveBeenCalledWith(
        googleTokenMock,
      );
      expect(AuthServiceMock.rrssBaseSignIn).toHaveBeenCalledWith(
        userDataMock.email,
      );
    });
  });
});
