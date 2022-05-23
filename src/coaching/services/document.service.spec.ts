import { Test, TestingModule } from '@nestjs/testing';
import { DocumentRepository } from 'src/coaching/repositories/document.repository';
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
  const documentMock2 = { ...documentMock, id: 2 };

  const data = {
    coachApplicationId: documentMock.coachApplication.id,
    name: documentMock.name,
    type: documentMock.type,
    file: documentMock.file,
  };

  const editDocumentDtoMock = {
    name: 'update name',
  };

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
    jest.clearAllMocks();
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

  describe('findAllDocuments', () => {
    beforeAll(() => {
      DocumentRepositoryMock.findAll.mockResolvedValue([documentMock]);
    });
    it('should call findAll and return and array of documents', async () => {
      const result = await service.findAll({});
      expect(DocumentRepositoryMock.findAll).toHaveBeenCalledWith(
        {},
        undefined,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([documentMock]);
    });
  });

  describe('findDocumentsById', () => {
    beforeAll(() => {
      DocumentRepositoryMock.findOneBy.mockResolvedValue(documentMock);
    });
    it('should call findOneBy and return and a document by id', async () => {
      const result = await service.findOneBy({
        where: { id: documentMock.id },
      });
      expect(DocumentRepositoryMock.findOneBy).toHaveBeenCalledWith(
        {
          id: documentMock.id,
        },
        undefined,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(documentMock);
    });
  });

  describe('createDocument', () => {
    beforeAll(() => {
      DocumentRepositoryMock.create.mockResolvedValue(documentMock);
    });
    it('should call create and return and a new document', async () => {
      const result = await service.create(data);
      expect(DocumentRepositoryMock.create).toHaveBeenCalled();
      expect(DocumentRepositoryMock.create).toHaveBeenCalledWith(data);
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(documentMock);
    });
  });

  describe('createManyDocument', () => {
    beforeAll(() => {
      DocumentRepositoryMock.createMany.mockResolvedValue([
        documentMock,
        documentMock2,
      ]);
    });
    it('should call createMany and return and a array of coachingAreas', async () => {
      const result = await service.createMany([data, data]);
      expect(DocumentRepositoryMock.createMany).toHaveBeenCalled();
      expect(DocumentRepositoryMock.createMany).toHaveBeenCalledWith([
        data,
        data,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(documentMock);
      expect(result[1]).toEqual(documentMock2);
    });
  });

  describe('updateDocument', () => {
    const updatedDocument = {
      ...documentMock,
      name: 'update name',
    };
    beforeAll(() => {
      DocumentRepositoryMock.update.mockResolvedValue(updatedDocument);
    });
    it('should call update and return a document updated', async () => {
      const result = await service.update(documentMock.id, editDocumentDtoMock);
      expect(DocumentRepositoryMock.update).toHaveBeenCalled();
      expect(DocumentRepositoryMock.update).toHaveBeenCalledWith(
        documentMock.id,
        editDocumentDtoMock,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(updatedDocument);
    });
  });

  describe('updateManydocuments', () => {
    const updatedDocuments = [
      { ...documentMock, name: 'update name' },
      { ...documentMock2, name: 'update name' },
    ];
    const ids = [documentMock.id, documentMock2.id];
    beforeAll(() => {
      DocumentRepositoryMock.updateMany.mockResolvedValue(updatedDocuments);
    });
    it('should call updateMany and return and a array of updated documents', async () => {
      const result = await service.updateMany(ids, editDocumentDtoMock);
      expect(DocumentRepositoryMock.updateMany).toHaveBeenCalled();
      expect(DocumentRepositoryMock.updateMany).toHaveBeenCalledWith(
        ids,
        editDocumentDtoMock,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(updatedDocuments[0]);
      expect(result[1]).toEqual(updatedDocuments[1]);
    });
  });

  describe('deleteDocument', () => {
    beforeAll(() => {
      DocumentRepositoryMock.delete.mockResolvedValue(documentMock.id);
    });
    it('should call delete and return the id of the coachingArea deleted', async () => {
      const result = await service.delete(documentMock.id);
      expect(DocumentRepositoryMock.delete).toHaveBeenCalled();
      expect(DocumentRepositoryMock.delete).toHaveBeenCalledWith(
        documentMock.id,
      );
      expect(result).toBe(documentMock.id);
    });
  });
});
