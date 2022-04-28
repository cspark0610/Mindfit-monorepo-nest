import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from 'src/auth/services/jwt.strategy';

describe('JwtStrategy', () => {
  let service: JwtStrategy;

  const responseMock = {
    userId: 1,
    email: 'EMAIL@MAIL.COM',
    role: 'SUPER_USER',
  };
  const JwtStrategyMock = {
    validate: jest.fn().mockImplementation(() => Promise.resolve(responseMock)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: JwtStrategy,
          useValue: JwtStrategyMock,
        },
      ],
    }).compile();
    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    const payload = { ...responseMock } as any;
    it('should return an object with userId, email and role as response', async () => {
      const result = await service.validate(payload);
      expect(result).toEqual(responseMock);
    });
  });
});
