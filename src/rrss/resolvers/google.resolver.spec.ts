import { Test, TestingModule } from '@nestjs/testing';
import { GoogleResolver } from 'src/rrss/resolvers/google.resolver';
import { GoogleService } from 'src/rrss/services/google.service';

describe('GoogleResolver', () => {
  let resolver: GoogleResolver;

  const authMock = {
    token: 'TEST_TOKEN',
    refreshToken: 'TEST_TOKEN',
  };

  const GoogleServiceMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  const googleTokenMock = 'TEST_GOOGLE_TOKEN';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleResolver,
        {
          provide: GoogleService,
          useValue: GoogleServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<GoogleResolver>(GoogleResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signUp', () => {
    beforeAll(() => {
      GoogleServiceMock.signUp.mockResolvedValue(authMock);
    });

    it('Should return session tokens', async () => {
      const result = await resolver.signUpWithGoogle({
        token: googleTokenMock,
      });
      expect(result).toEqual(authMock);
      expect(GoogleServiceMock.signUp).toHaveBeenCalledWith({
        token: googleTokenMock,
      });
    });
  });

  describe('signIn', () => {
    beforeAll(() => {
      GoogleServiceMock.signIn.mockResolvedValue(authMock);
    });

    it('Should return session tokens', async () => {
      const result = await resolver.signInWithGoogle({
        token: googleTokenMock,
      });
      expect(result).toEqual(authMock);
      expect(GoogleServiceMock.signIn).toHaveBeenCalledWith({
        token: googleTokenMock,
      });
    });
  });
});
