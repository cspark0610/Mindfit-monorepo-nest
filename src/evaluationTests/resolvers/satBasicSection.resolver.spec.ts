import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicSectionsResolver } from 'src/evaluationTests/resolvers/satBasicSection.resolver';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';

describe('SatBasicSectionsResolver', () => {
  let resolver: SatBasicSectionsResolver;

  const SatBasicSectionsServiceMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicSectionsResolver,
        {
          provide: SatBasicSectionsService,
          useValue: SatBasicSectionsServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<SatBasicSectionsResolver>(SatBasicSectionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
