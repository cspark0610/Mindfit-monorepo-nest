import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoreConfig } from '../models/CoreConfig.model';
import { CoreConfigService } from './coreConfig.service';

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

  const coreConfigRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreConfigService,
        {
          provide: getRepositoryToken(CoreConfig),
          useValue: coreConfigRepositoryMock,
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
      coreConfigRepositoryMock.save.mockResolvedValue(coreConfigMock);
    });

    it('Should create a CoreConfig', async () => {
      const result = await service.createCoreConfig(data);

      expect(result).toEqual(coreConfigMock);
      expect(coreConfigRepositoryMock.save).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoreConfigs', () => {
    beforeAll(() => {
      coreConfigRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coreConfigMock],
        }),
      });
    });

    it('Should edit a CoreConfig', async () => {
      const result = await service.editCoreConfigs(coreConfigMock.id, data);

      expect(result).toEqual(coreConfigMock);
      expect(coreConfigRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple CoreConfigs', async () => {
      const result = await service.editCoreConfigs([coreConfigMock.id], data);

      expect(result).toEqual([coreConfigMock]);
      expect(coreConfigRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getCoreConfigs', () => {
    beforeAll(() => {
      coreConfigRepositoryMock.find.mockResolvedValue([coreConfigMock]);
    });

    it('Should return multiple CoreConfigs', async () => {
      const result = await service.getCoreConfigs(undefined);

      expect(result).toEqual([coreConfigMock]);
      expect(coreConfigRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getCoreConfig', () => {
    beforeAll(() => {
      coreConfigRepositoryMock.findOne.mockResolvedValue(coreConfigMock);
    });

    it('Should return a CoreConfig', async () => {
      const result = await service.getCoreConfig(coreConfigMock.id);

      expect(result).toEqual(coreConfigMock);
      expect(coreConfigRepositoryMock.findOne).toHaveBeenCalledWith(
        coreConfigMock.id,
      );
    });
  });

  describe('deleteCoreConfigs', () => {
    beforeAll(() => {
      coreConfigRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoreConfig', async () => {
      const result = await service.deleteCoreConfigs(coreConfigMock.id);

      expect(result).toEqual(1);
      expect(coreConfigRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple CoreConfigs', async () => {
      const result = await service.deleteCoreConfigs([coreConfigMock.id]);

      expect(result).toEqual(1);
      expect(coreConfigRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
