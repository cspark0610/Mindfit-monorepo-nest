import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from 'src/users/resolvers/users.resolver';
import { UsersService } from 'src/users/services/users.service';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';

describe('UsersResolver', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
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
    isSuperUser: true,
    role: Roles.SUPER_USER,
  };
  const userMock2 = { ...userMock, id: 2 };

  const sessionMock = {
    userId: userMock.id,
    email: userMock.email,
    role: userMock.role,
  };

  const UsersServiceMock = {
    changePassword: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createUser: jest.fn(),
    createManyUser: jest.fn(),
    update: jest.fn(),
    updateUser: jest.fn(),
    updateManyUsers: jest.fn(),
    deleteUser: jest.fn(),
    deleteManyUsers: jest.fn(),
  };

  const data = {
    email: userMock.email,
    name: userMock.name,
    password: userMock.password,
    role: userMock.role,
  };
  const dataArray = [{ ...data }, { ...data }];

  const editUserDtoMock = { name: 'changedName' };

  const editUsersDtoMock = { isActive: false };
  const editedUsersMock = [
    { ...userMock, id: 1, isActive: editUsersDtoMock.isActive },
    { ...userMock, id: 2, isActive: editUsersDtoMock.isActive },
  ];

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

  describe('findAllUsers', () => {
    beforeAll(() => {
      UsersServiceMock.findAll.mockResolvedValue([userMock, userMock]);
    });
    it('should call findAll and return and array of users', async () => {
      const result = await resolver.findAll();
      expect(UsersServiceMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([userMock, userMock]);
    });
    it('Should throw mindfit exception when a user without roles of staff o super user fetch all users', async () => {
      UsersServiceMock.findAll.mockImplementation(() => {
        throw new MindfitException({
          error: 'Invalid User Role',
          errorCode: `USER_ROLE_UNAUTHORIZED`,
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
      try {
        await resolver.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('Invalid User Role');
        expect(error.response.errorCode).toEqual(`USER_ROLE_UNAUTHORIZED`);
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('findUserById', () => {
    beforeAll(() => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
    });
    it('should call findOne and return and a user by id', async () => {
      const result = await resolver.findOne(userMock.id);
      expect(UsersServiceMock.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(userMock);
    });
    it('Should throw mindfit exception when a user without roles of staff o super user fetch a user by id', async () => {
      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error: 'Invalid User Role',
          errorCode: `USER_ROLE_UNAUTHORIZED`,
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      });
      try {
        await resolver.findOne();
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('Invalid User Role');
        expect(error.response.errorCode).toEqual(`USER_ROLE_UNAUTHORIZED`);
        expect(error.status).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('changePassword', () => {
    beforeAll(() => {
      UsersServiceMock.changePassword.mockResolvedValue(true);
    });
    it('should call changePassword', async () => {
      const data = {
        actualPassword: 'TEST_PASSWORD',
        password: '123456',
        confirmPassword: '123456',
      };
      const result = await resolver.changePassword(sessionMock, data);
      expect(UsersServiceMock.changePassword).toHaveBeenCalledWith(
        sessionMock.userId,
        data,
      );
      expect(result).toEqual(true);
    });
  });

  describe('createStaffUser', () => {
    const userStaffMock = {
      ...userMock,
      role: Roles.STAFF,
    };
    beforeAll(() => {
      UsersServiceMock.create.mockResolvedValue(userStaffMock);
    });
    it('should call create', async () => {
      const data = {
        isStaff: true,
        isSuperuser: false,
      };
      const result = await resolver.createStaffUser(data as any);
      expect(UsersServiceMock.create).toHaveBeenCalled();
      expect(result).toEqual(userStaffMock);
      expect(result.role).toEqual(Roles.STAFF);
    });
  });

  describe('activateUser', () => {
    const userActivatedMock = { ...userMock, isActive: true };
    beforeAll(() => {
      UsersServiceMock.update.mockResolvedValue(userActivatedMock);
    });
    it('should call update ', async () => {
      const result = (await resolver.activateUser(userMock.id)) as User;
      expect(UsersServiceMock.update).toHaveBeenCalled();
      expect(result).toEqual(userActivatedMock);
      expect(result.isActive).toEqual(true);
    });
  });

  describe('deactivateUser', () => {
    const deactivetedMock = { ...userMock, isActive: false };
    beforeAll(() => {
      UsersServiceMock.update.mockResolvedValue(deactivetedMock);
    });
    it('should call update ', async () => {
      const result = (await resolver.activateUser(userMock.id)) as User;
      expect(UsersServiceMock.update).toHaveBeenCalled();
      expect(result).toEqual(deactivetedMock);
      expect(result.isActive).toEqual(false);
    });
  });

  describe('createUser', () => {
    beforeAll(() => {
      UsersServiceMock.createUser.mockResolvedValue(userMock);
    });
    it('should call createUser', async () => {
      const result = (await resolver.create(data)) as User;
      expect(UsersServiceMock.createUser).toHaveBeenCalledWith(data);
      expect(result).toBeDefined();
      expect(result).toEqual(userMock);
    });
  });

  describe('createManyUser', () => {
    beforeAll(() => {
      UsersServiceMock.createManyUser.mockResolvedValue([userMock, userMock]);
    });
    it('should call createUser', async () => {
      const result = (await resolver.createMany(dataArray)) as User[];
      expect(UsersServiceMock.createManyUser).toHaveBeenCalledWith(dataArray);
      expect(result).toBeDefined();
      expect(result).toEqual([userMock, userMock]);
    });
  });

  describe('updateUser', () => {
    const editedUserMock = { ...userMock, name: editUserDtoMock.name };
    beforeAll(() => {
      UsersServiceMock.updateUser.mockResolvedValue(editedUserMock);
    });
    it('should call updateUser', async () => {
      const result = (await resolver.update(
        sessionMock,
        userMock.id,
        editUserDtoMock,
      )) as User;
      expect(UsersServiceMock.updateUser).toHaveBeenCalledWith(
        sessionMock,
        userMock.id,
        editUserDtoMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(editedUserMock);
    });
  });

  describe('updateManyUsers', () => {
    beforeAll(() => {
      UsersServiceMock.updateManyUsers.mockResolvedValue(editedUsersMock);
    });
    it('should call updateUser', async () => {
      const result = (await resolver.updateMany(
        [userMock.id, userMock2.id],
        editUsersDtoMock,
      )) as User[];
      expect(UsersServiceMock.updateManyUsers).toHaveBeenCalledWith(
        [userMock.id, userMock2.id],
        editUsersDtoMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(editedUsersMock);
    });
  });

  describe('deleteUser', () => {
    beforeAll(() => {
      UsersServiceMock.deleteUser.mockResolvedValue(userMock.id);
    });
    it('should call delete and return the id of the user deleted', async () => {
      const result = await resolver.delete(sessionMock, userMock.id);
      expect(UsersServiceMock.deleteUser).toHaveBeenCalledWith(
        sessionMock,
        userMock.id,
      );
      expect(result).toEqual(userMock.id);
    });
  });

  describe('deleteManyUsers', () => {
    beforeAll(() => {
      UsersServiceMock.deleteManyUsers.mockResolvedValue([
        userMock.id,
        userMock2.id,
      ]);
    });
    it('should call deleteMany and return an array of ids of the users deleted', async () => {
      const result = await resolver.deleteMany(sessionMock, [
        userMock.id,
        userMock2.id,
      ]);
      expect(UsersServiceMock.deleteManyUsers).toHaveBeenCalledWith(
        sessionMock,
        [userMock.id, userMock2.id],
      );
      expect(result).toEqual([userMock.id, userMock2.id]);
    });
  });
});
