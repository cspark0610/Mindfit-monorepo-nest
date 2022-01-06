import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

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

  const UsersServiceMock = {
    getUsers: jest.fn(),
    getUser: jest.fn(),
    createUser: jest.fn(),
    editUsers: jest.fn(),
    bulkEditUsers: jest.fn(),
    deleteUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUsers', () => {
    beforeAll(() => {
      UsersServiceMock.getUsers.mockResolvedValue([userMock]);
    });

    it('Should return an array of User', async () => {
      const result = await resolver.getUsers();
      expect(result).toEqual([userMock]);
      expect(UsersServiceMock.getUsers).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    beforeAll(() => {
      UsersServiceMock.getUser.mockResolvedValue(userMock);
    });

    it('Should return a specific User', async () => {
      const result = await resolver.getUser(1);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.getUser).toHaveBeenCalledWith(1);
    });
  });

  describe('createUser', () => {
    beforeAll(() => {
      UsersServiceMock.createUser.mockResolvedValue(userMock);
    });

    it('Should create an User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: '1234',
      };

      const result = await resolver.createUser(data);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.createUser).toHaveBeenCalledWith(data);
    });
  });

  describe('createStaffUser', () => {
    beforeAll(() => {
      UsersServiceMock.createUser.mockResolvedValue(userMock);
    });

    it('Should create a Staff User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: '1234',
        isStaff: true,
        isSuperuser: false,
      };

      const result = await resolver.createStaffUser(data);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.createUser).toHaveBeenCalledWith(data);
    });
  });

  describe('editUser', () => {
    beforeAll(() => {
      UsersServiceMock.editUsers.mockResolvedValue(userMock);
    });

    it('Should edit an specific User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: '1234',
        isVerified: userMock.isVerified,
        isActive: userMock.isActive,
      };

      const result = await resolver.editUser(1, data);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.editUsers).toHaveBeenCalledWith(1, data);
    });
  });

  describe('editUsers', () => {
    beforeAll(() => {
      UsersServiceMock.editUsers.mockResolvedValue([userMock]);
    });

    it('Should edit multiple Users', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: '1234',
        isVerified: userMock.isVerified,
        isActive: userMock.isActive,
      };

      const result = await resolver.editUsers([1], data);
      expect(result).toEqual([userMock]);
      expect(UsersServiceMock.editUsers).toHaveBeenCalledWith([1], data);
    });
  });

  describe('activateUser', () => {
    beforeAll(() => {
      UsersServiceMock.editUsers.mockResolvedValue(userMock);
    });

    it('Should active an specific Users', async () => {
      const result = await resolver.activateUser(1);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.editUsers).toHaveBeenCalledWith(1, {
        isActive: true,
      });
    });
  });

  describe('deactivateUser', () => {
    beforeAll(() => {
      UsersServiceMock.editUsers.mockResolvedValue(userMock);
    });

    it('Should deactivate an specific Users', async () => {
      const result = await resolver.deactivateUser(1);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.editUsers).toHaveBeenCalledWith(1, {
        isActive: false,
      });
    });
  });

  describe('deleteUser', () => {
    beforeAll(() => {
      UsersServiceMock.deleteUsers.mockResolvedValue(1);
    });

    it('Should delete an specific Users', async () => {
      const result = await resolver.deleteUser(1);
      expect(result).toEqual(1);
      expect(UsersServiceMock.deleteUsers).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteUsers', () => {
    beforeAll(() => {
      UsersServiceMock.deleteUsers.mockResolvedValue(2);
    });

    it('Should delete multiple Users', async () => {
      const result = await resolver.deleteUsers([1, 2]);
      expect(result).toEqual(2);
      expect(UsersServiceMock.deleteUsers).toHaveBeenCalledWith([1, 2]);
    });
  });
});
