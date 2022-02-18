import { Test, TestingModule } from '@nestjs/testing';
import { DocumentRepository } from 'src/coaching/repositories/document.repository';
import { DocumentService } from 'src/coaching/services/document.service';

describe('DocumentService', () => {
  let service: DocumentService;

  // const documentMock = {
  //   id: 1,
  //   coachApplication: {
  //     id: 1,
  //   },
  //   name: 'TEST_NAME',
  //   type: 'TEST_TYPE',
  //   file: 'TEST_FILE',
  // };

  // const data = {
  //   coachApplicationId: documentMock.coachApplication.id,
  //   name: documentMock.name,
  //   type: documentMock.type,
  //   file: documentMock.file,
  // };

  const DocumentRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: DocumentRepository,
          useValue: DocumentRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
