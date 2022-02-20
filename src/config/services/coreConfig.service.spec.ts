import { Test, TestingModule } from '@nestjs/testing';
import { CoreConfigRepository } from 'src/config/repositories/config.repository';
import { CoreConfigService } from 'src/config/services/coreConfig.service';

describe('CoreConfigService', () => {
  let service: CoreConfigService;

  const coreConfigMock = {
    id: 1,
    name: 'TEST_NAME',
    value: 'TEST_VALUE',
    jsonValue: 'TEST_JSON_VALUE',
  };

  const data = {
    name: coreConfigMock.name,
    value: coreConfigMock.value,
    jsonValue: coreConfigMock.jsonValue,
  };

  const CoreConfigRepositoryMock = {
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
        CoreConfigService,
        {
          provide: CoreConfigRepository,
          useValue: CoreConfigRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoreConfigService>(CoreConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoreConfig', () => {
    beforeAll(() => {
      CoreConfigRepositoryMock.create.mockReturnValue(coreConfigMock);
    });

    it('Should create a CoreConfig', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coreConfigMock);
      expect(CoreConfigRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoreConfigs', () => {
    beforeAll(() => {
      CoreConfigRepositoryMock.update.mockReturnValue(coreConfigMock);
      CoreConfigRepositoryMock.updateMany.mockReturnValue([coreConfigMock]);
    });

    it('Should edit a CoreConfig', async () => {
      const result = await service.update(coreConfigMock.id, data);

      expect(result).toEqual(coreConfigMock);
      expect(CoreConfigRepositoryMock.update).toHaveBeenCalledWith(
        coreConfigMock.id,
        data,
      );
    });

    it('Should edit multiple CoreConfigs', async () => {
      const result = await service.updateMany([coreConfigMock.id], data);

      expect(result).toEqual([coreConfigMock]);
      expect(CoreConfigRepositoryMock.updateMany).toHaveBeenCalledWith(
        [coreConfigMock.id],
        data,
      );
    });
  });

  describe('getCoreConfigs', () => {
    beforeAll(() => {
      CoreConfigRepositoryMock.findAll.mockResolvedValue([coreConfigMock]);
    });

    it('Should return multiple CoreConfigs', async () => {
      const result = await service.findAll(undefined);

      expect(result).toEqual([coreConfigMock]);
      expect(CoreConfigRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getCoreConfig', () => {
    beforeAll(() => {
      CoreConfigRepositoryMock.findOneBy.mockResolvedValue(coreConfigMock);
    });

    it('Should return a CoreConfig', async () => {
      const result = await service.findOne(coreConfigMock.id);

      expect(result).toEqual(coreConfigMock);
      expect(CoreConfigRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: coreConfigMock.id,
      });
    });
  });

  describe('deleteCoreConfigs', () => {
    beforeAll(() => {
      CoreConfigRepositoryMock.delete.mockReturnValue(1);
    });

    it('Should delete a specific CoreConfig', async () => {
      const result = await service.delete(coreConfigMock.id);

      expect(result).toEqual(1);
      expect(CoreConfigRepositoryMock.delete).toHaveBeenCalledWith(
        coreConfigMock.id,
      );
    });

    it('Should delete multiple CoreConfigs', async () => {
      const result = await service.delete([coreConfigMock.id]);

      expect(result).toEqual(1);
      expect(CoreConfigRepositoryMock.delete).toHaveBeenCalledWith([
        coreConfigMock.id,
      ]);
    });
  });
});
