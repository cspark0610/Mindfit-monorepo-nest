import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
import { SatBasicSectionRepository } from 'src/evaluationTests/repositories/satBasicSection.repository';

describe('SatBasicSectionsService', () => {
  let service: SatBasicSectionsService;

  const SatBasicSectionRepositoryMock = {};
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicSectionsService,
        {
          provide: SatBasicSectionRepository,
          useValue: SatBasicSectionRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<SatBasicSectionsService>(SatBasicSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
