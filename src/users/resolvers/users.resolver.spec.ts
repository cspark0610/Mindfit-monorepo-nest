import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { UsersResolver } from './users.resolver';

describe('UsersResolver', () => {
  let resolver: UsersResolver;

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    password: 'TEST_PASSWORD',
    languages: 'TEST_LANGUAGE',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
  };

  const sessionMock = {
    userId: userMock.id,
    email: userMock.email,
  };

  const UsersServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    changePassword: jest.fn(),
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

  describe('findAll', () => {
    beforeAll(() => {
      UsersServiceMock.findAll.mockResolvedValue([userMock]);
    });

    it('Should return an array of User', async () => {
      const result = await resolver.findAll();
      expect(result).toEqual([userMock]);
      expect(UsersServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    beforeAll(() => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
    });

    it('Should return a specific User', async () => {
      const result = await resolver.findOne(userMock.id);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.findOne).toHaveBeenCalledWith(userMock.id);
    });
  });

  describe('create', () => {
    beforeAll(() => {
      UsersServiceMock.create.mockResolvedValue(userMock);
    });

    it('Should create an User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: userMock.password,
      };

      const result = await resolver.create(data);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('createStaffUser', () => {
    beforeAll(() => {
      UsersServiceMock.create.mockResolvedValue(userMock);
    });

    it('Should create a Staff User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: userMock.password,
        isStaff: true,
        isSuperuser: false,
      };

      const result = await resolver.createStaffUser(data);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('update', () => {
    beforeAll(() => {
      UsersServiceMock.update.mockResolvedValue(userMock);
    });

    it('Should edit an specific User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: userMock.password,
        isVerified: userMock.isVerified,
        isActive: userMock.isActive,
      };

      const result = await resolver.update(1, data);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.update).toHaveBeenCalledWith(1, data);
    });
  });

  describe('updateMany', () => {
    beforeAll(() => {
      UsersServiceMock.update.mockResolvedValue([userMock]);
    });

    it('Should edit multiple Users', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: userMock.password,
        isVerified: userMock.isVerified,
        isActive: userMock.isActive,
      };

      const result = await resolver.updateMany([1], data);
      expect(result).toEqual([userMock]);
      expect(UsersServiceMock.update).toHaveBeenCalledWith([1], data);
    });
  });

  describe('activateUser', () => {
    beforeAll(() => {
      UsersServiceMock.update.mockResolvedValue(userMock);
    });

    it('Should active an specific Users', async () => {
      const result = await resolver.activateUser(userMock.id);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.update).toHaveBeenCalledWith(1, {
        isActive: true,
      });
    });
  });

  describe('deactivateUser', () => {
    beforeAll(() => {
      UsersServiceMock.update.mockResolvedValue(userMock);
    });

    it('Should deactivate an specific Users', async () => {
      const result = await resolver.deactivateUser(userMock.id);
      expect(result).toEqual(userMock);
      expect(UsersServiceMock.update).toHaveBeenCalledWith(1, {
        isActive: false,
      });
    });
  });

  describe('delete', () => {
    beforeAll(() => {
      UsersServiceMock.delete.mockResolvedValue(1);
    });

    it('Should delete an specific Users', async () => {
      const result = await resolver.delete(userMock.id);
      expect(result).toEqual(1);
      expect(UsersServiceMock.delete).toHaveBeenCalledWith(userMock.id);
    });
  });

  describe('deleteMany', () => {
    beforeAll(() => {
      UsersServiceMock.delete.mockResolvedValue(2);
    });

    it('Should delete multiple Users', async () => {
      const result = await resolver.deleteMany([1, 2]);
      expect(result).toEqual(2);
      expect(UsersServiceMock.delete).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe('changePassword', () => {
    beforeAll(() => {
      UsersServiceMock.changePassword.mockResolvedValue(userMock);
    });

    it('Should change User password', async () => {
      const data = {
        password: userMock.password,
        confirmPassword: userMock.password,
      };

      const result = await resolver.changePassword(sessionMock, data);
      expect(result).toEqual(true);
      expect(UsersServiceMock.changePassword).toHaveBeenCalledWith(
        sessionMock.userId,
        data,
      );
    });
  });
});
