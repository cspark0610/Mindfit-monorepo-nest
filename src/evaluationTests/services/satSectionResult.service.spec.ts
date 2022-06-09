import { Test, TestingModule } from '@nestjs/testing';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';
import { SatSectionResultRepository } from 'src/evaluationTests/repositories/satSectionResult.repository';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';

describe('SatSectionResultsService', () => {
  let service: SatSectionResultsService;

  const SatSectionResultMock = {
    id: 1,
    satReport: {},
    section: null,
    questions: [
      {
        id: 1,
        section: {},
        question: {},
        answersSelected: [],
      },
    ],
  } as SatSectionResult;

  const SatSectionResultRepositoryMock = {
    getQueryBuilder: jest.fn().mockImplementation(() => ({
      leftJoinAndSelect: jest.fn().mockImplementation(() => ({
        leftJoinAndSelect: jest.fn().mockImplementation(() => ({
          where: jest.fn().mockImplementation(() => ({
            andWhere: jest.fn().mockImplementation(() => ({
              getOne: jest.fn().mockImplementation(() => SatSectionResultMock),
            })),
          })),
        })),
      })),
    })),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatSectionResultsService,
        {
          provide: SatSectionResultRepository,
          useValue: SatSectionResultRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<SatSectionResultsService>(SatSectionResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSectionResultsForEvaluation', () => {
    const satReportId = 1;
    const codeName = SectionCodenames.LEADERSHIP;
    it('should return a SatSectionResult', async () => {
      const result = await service.getSectionResultsForEvaluation({
        satReportId,
        codeName,
      });
      expect(result).toEqual(SatSectionResultMock);
      expect(SatSectionResultRepositoryMock.getQueryBuilder).toHaveBeenCalled();
    });
  });
});
