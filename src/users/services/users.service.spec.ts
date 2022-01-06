import { Test, TestingModule } from '@nestjs/testing';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    beforeAll(() => {
      jest
        .spyOn(User, 'create')
        .mockImplementation()
        .mockResolvedValue(userMock);
    });

    it('Should create an User', async () => {
      const result = await service.createUser({
        email: userMock.email,
        name: userMock.name,
        password: '1234',
      });

      expect(result).toEqual(userMock);
    });
  });

  describe('getUsers', () => {
    beforeAll(() => {
      jest
        .spyOn(User, 'findAll')
        .mockImplementation()
        .mockResolvedValue([userMock as any]);
    });

    it('Should return multiple Users', async () => {
      const result = await service.getUsers();

      expect(result).toEqual([userMock]);
    });
  });

  describe('getUser', () => {
    beforeAll(() => {
      jest
        .spyOn(User, 'findByPk')
        .mockImplementation()
        .mockResolvedValue(userMock as any);
    });

    it('Should return a specific User', async () => {
      const result = await service.getUser(1);

      expect(result).toEqual(userMock);
    });
  });

  describe('editUsers', () => {
    it('Should edit a specific User', async () => {
      jest
        .spyOn(User, 'update')
        .mockImplementation()
        .mockResolvedValue([1, [userMock as any]]);

      const result = await service.editUsers(1, {});

      expect(result).toEqual(userMock);
    });

    it('Should edit multiple Users', async () => {
      jest
        .spyOn(User, 'update')
        .mockImplementation()
        .mockResolvedValue([2, [userMock as any, userMock as any]]);

      const result = await service.editUsers([1, 2], {});

      expect(result).toEqual([userMock, userMock]);
    });
  });

  describe('deleteUsers', () => {
    it('Should delete a specific User', async () => {
      jest.spyOn(User, 'destroy').mockImplementation().mockResolvedValue(1);

      const result = await service.deleteUsers(1);

      expect(result).toEqual(1);
    });

    it('Should delete multiple Users', async () => {
      jest.spyOn(User, 'destroy').mockImplementation().mockResolvedValue(2);

      const result = await service.deleteUsers([1, 2]);

      expect(result).toEqual(2);
    });
  });
});
