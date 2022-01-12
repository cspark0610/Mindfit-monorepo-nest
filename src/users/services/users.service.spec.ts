import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../models/users.model';
import { UsersService } from '../services/users.service';

describe('UsersService', () => {
  let service: UsersService;

  const userMock = {
    id: 1,
    name: 'name',
    email: 'email',
    languages: 'language',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
  };

  const usersRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    beforeAll(() => {
      usersRepositoryMock.create.mockReturnValue(userMock);
      usersRepositoryMock.save.mockResolvedValue(userMock);
    });

    it('Should create an User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: '1234',
      };

      const result = await service.create(data);

      expect(result).toEqual(userMock);
      expect(usersRepositoryMock.create).toHaveBeenCalledWith(data);
      expect(usersRepositoryMock.save).toHaveBeenCalledWith(userMock);
    });
  });

  describe('createInvitedUser', () => {
    beforeAll(() => {
      usersRepositoryMock.save.mockResolvedValue(userMock);
    });

    it('Should create an Invited User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: '1234',
      };

      const result = await service.createInvitedUser(data);

      expect(result).toEqual(userMock);
      expect(usersRepositoryMock.save).toHaveBeenCalledWith(data);
    });

    it('Should create an Invited User generating password', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
      };

      const result = await service.createInvitedUser(data);

      expect(result).toEqual(userMock);
      expect(usersRepositoryMock.save).toHaveBeenCalledWith(data);
    });
  });

  describe('findAll', () => {
    beforeAll(() => {
      usersRepositoryMock.find.mockResolvedValue([userMock]);
    });

    it('Should return multiple Users', async () => {
      const result = await service.findAll();

      expect(result).toEqual([userMock]);
      expect(usersRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('findOne', () => {
    beforeAll(() => {
      usersRepositoryMock.findOne.mockResolvedValue(userMock);
    });

    it('Should return a specific User', async () => {
      const result = await service.findOne(userMock.id);

      expect(result).toEqual(userMock);
      expect(usersRepositoryMock.findOne).toHaveBeenCalledWith(userMock.id);
    });
  });

  describe('findOneBy', () => {
    beforeAll(() => {
      usersRepositoryMock.findOne.mockResolvedValue(userMock);
    });

    it('Should return a specific User', async () => {
      const result = await service.findOneBy({ email: userMock.email });

      expect(result).toEqual(userMock);
      expect(usersRepositoryMock.findOne).toHaveBeenCalledWith({
        email: userMock.email,
      });
    });
  });

  describe('update', () => {
    it('Should edit a specific User', async () => {
      usersRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [{ ...userMock, name: 'TEST_NAME' }],
        }),
      });

      const result = await service.update(userMock.id, {
        name: 'TEST_NAME',
      });

      expect(result).toEqual({ ...userMock, name: 'TEST_NAME' });
      expect(usersRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple Users', async () => {
      usersRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [
            { ...userMock, name: 'TEST_NAME' },
            { ...userMock, name: 'TEST_NAME' },
          ],
        }),
      });

      const result = await service.update([1, 2], {
        name: 'TEST_NAME',
      });

      expect(result).toEqual([
        { ...userMock, name: 'TEST_NAME' },
        { ...userMock, name: 'TEST_NAME' },
      ]);
      expect(usersRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('Should delete a specific User', async () => {
      usersRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });

      const result = await service.delete(userMock.id);

      expect(result).toEqual(1);
      expect(usersRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple Users', async () => {
      usersRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 2,
        }),
      });

      const result = await service.delete([1, 2]);

      expect(result).toEqual(2);
      expect(usersRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
