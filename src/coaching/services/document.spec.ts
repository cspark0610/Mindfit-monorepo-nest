import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentDto } from 'src/coaching/dto/document.dto';
import { Document } from 'src/coaching/models/document.model';
import { DocumentService } from 'src/coaching/services/document.service';

describe('DocumentService', () => {
  let service: DocumentService;

  const documentMock = {
    id: 1,
    coachApplication: {
      id: 1,
    },
    name: 'TEST_NAME',
    type: 'TEST_TYPE',
    file: 'TEST_FILE',
  };

  const data = {
    coachApplicationId: documentMock.coachApplication.id,
    name: documentMock.name,
    type: documentMock.type,
    file: documentMock.file,
  };

  const DocumentRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: DocumentRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDocument', () => {
    beforeAll(() => {
      jest.spyOn(DocumentDto, 'from').mockResolvedValue(documentMock as any);

      DocumentRepositoryMock.save.mockResolvedValue(documentMock);
    });

    it('Should create a Document', async () => {
      const result = await service.createDocument(data);

      expect(result).toEqual(documentMock);
      expect(jest.spyOn(DocumentDto, 'from')).toHaveBeenCalledWith(data);
      expect(DocumentRepositoryMock.save).toHaveBeenCalledWith(documentMock);
    });
  });

  describe('editDocuments', () => {
    beforeAll(() => {
      DocumentRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [documentMock],
        }),
      });
    });

    it('Should edit a Document', async () => {
      const result = await service.editDocuments(documentMock.id, data);

      expect(result).toEqual(documentMock);
      expect(DocumentRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple Documents', async () => {
      const result = await service.editDocuments([documentMock.id], data);

      expect(result).toEqual([documentMock]);
      expect(DocumentRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getDocuments', () => {
    beforeAll(() => {
      DocumentRepositoryMock.find.mockResolvedValue([documentMock]);
    });

    it('Should return multiple Documents', async () => {
      const result = await service.getDocuments(undefined);

      expect(result).toEqual([documentMock]);
      expect(DocumentRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getDocument', () => {
    beforeAll(() => {
      DocumentRepositoryMock.findOne.mockResolvedValue(documentMock);
    });

    it('Should return a Document', async () => {
      const result = await service.getDocument(documentMock.id);

      expect(result).toEqual(documentMock);
      expect(DocumentRepositoryMock.findOne).toHaveBeenCalledWith(
        documentMock.id,
      );
    });
  });

  describe('deleteDocuments', () => {
    beforeAll(() => {
      DocumentRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific Document', async () => {
      const result = await service.deleteDocuments(documentMock.id);

      expect(result).toEqual(1);
      expect(DocumentRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple Documents', async () => {
      const result = await service.deleteDocuments([documentMock.id]);

      expect(result).toEqual(1);
      expect(DocumentRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
