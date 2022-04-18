import { Test, TestingModule } from '@nestjs/testing';
import { RefreshJwtStrategy } from 'src/auth/services/refreshJwt.strategy';
import { Request } from 'express';

describe('RefreshJwtStrategy', () => {
  let service: RefreshJwtStrategy;

  const responseMock = {
    userId: 1,
    email: 'EMAIL@MAIL.COM',
    role: 'SUPER_USER',
    refreshToken: 'REFRESH_TOKEN',
  };

  const reqMock = {
    headers: {
      authorization: 'Bearer REFRESH_TOKEN',
    },
  } as Request;

  const RefreshJwtStrategyMock = {
    validate: jest.fn().mockImplementation(() => Promise.resolve(responseMock)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RefreshJwtStrategy,
          useValue: RefreshJwtStrategyMock,
        },
      ],
    }).compile();
    service = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    const payload = { ...responseMock } as any;
    it('should return an object with userId, email, role and refreshToken as response', () => {
      expect(service.validate(reqMock, payload)).resolves.toEqual(responseMock);
    });
  });
});
