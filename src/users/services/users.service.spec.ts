import { Test, TestingModule } from '@nestjs/testing';
import { AwsSesService } from 'src/aws/services/ses.service';
import { Emails } from 'src/strapi/enum/emails.enum';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { UserRepository } from 'src/users/repositories/user.repository';
import { UsersService } from 'src/users/services/users.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';

describe('UsersService', () => {
  let service: UsersService;

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
    role: Roles.SUPER_USER,
  };

  const UserRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  const AwsSesServiceMock = {
    sendEmail: jest.fn(),
  };
  const createUserArrayDto = [{ ...userMock }, { ...userMock }];

  const sessionMock = {
    userId: 2,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.SUPER_USER,
  };

  const userSessionMock = {
    ...userMock,
    id: sessionMock.userId,
    email: sessionMock.email,
    role: sessionMock.role,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: UserRepositoryMock,
        },
        {
          provide: AwsSesService,
          useValue: AwsSesServiceMock,
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
      UserRepositoryMock.create.mockResolvedValue(userMock);
    });

    it('Should create an User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: userMock.password,
      };

      const result = await service.create(data);

      expect(result).toEqual(userMock);
      expect(UserRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('createManyUsers', () => {
    beforeAll(() => {
      UserRepositoryMock.createMany.mockResolvedValue([userMock, userMock]);
    });

    it('Should create an array of sers', async () => {
      const result = await service.createManyUser(createUserArrayDto);

      expect(result).toEqual([userMock, userMock]);
      expect(UserRepositoryMock.createMany).toHaveBeenCalledWith(
        createUserArrayDto,
      );
    });
  });

  describe('createInvitedUser', () => {
    beforeAll(() => {
      UserRepositoryMock.create.mockResolvedValue(userMock);
    });

    it('Should create an Invited User', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
        password: userMock.password,
      };

      const result = await service.createInvitedUser(data, Roles.COACHEE);

      expect(result).toEqual({
        user: userMock,
        password: userMock.password,
      });
      expect(UserRepositoryMock.create).toHaveBeenCalledWith({
        ...data,
        role: Roles.COACHEE,
      });
    });

    it('Should create an Invited User generating password', async () => {
      const data = {
        email: userMock.email,
        name: userMock.name,
      };

      jest
        .spyOn(String.prototype, 'slice')
        .mockImplementation()
        .mockReturnValue(userMock.password);

      const result = await service.createInvitedUser(data, Roles.COACHEE);

      expect(result).toEqual({
        user: userMock,
        password: userMock.password,
      });
      expect(UserRepositoryMock.create).toHaveBeenCalledWith({
        ...data,
        role: Roles.COACHEE,
      });
    });
  });

  describe('findAll', () => {
    beforeAll(() => {
      UserRepositoryMock.findAll.mockResolvedValue([userMock]);
    });

    it('Should return multiple Users', async () => {
      const result = await service.findAll({});
      expect(result).toEqual([userMock]);
      expect(UserRepositoryMock.findAll).toHaveBeenCalledWith({}, undefined);
    });
  });

  describe('findOne', () => {
    beforeAll(() => {
      UserRepositoryMock.findOneBy.mockResolvedValue(userMock);
    });

    it('Should return a specific User', async () => {
      const result = await service.findOne({ id: userMock.id });
      expect(result).toEqual(userMock);
      expect(UserRepositoryMock.findOneBy).toHaveBeenCalledWith(
        {
          id: userMock.id,
        },
        undefined,
      );
    });
  });

  describe('findOneBy', () => {
    beforeAll(() => {
      UserRepositoryMock.findOneBy.mockResolvedValue(userMock);
    });

    it('Should return a specific User', async () => {
      const result = await service.findOneBy({
        where: { email: userMock.email },
      });
      expect(result).toEqual(userMock);
      expect(UserRepositoryMock.findOneBy).toHaveBeenCalledWith(
        {
          email: userMock.email,
        },
        undefined,
      );
    });
  });

  describe('changePassword', () => {
    it('Should change User password', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(userMock as any);

      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(userMock as any);

      jest
        .spyOn(User, 'verifyPassword')
        .mockImplementation()
        .mockReturnValue(true);

      const result = await service.changePassword(userMock.id, {
        password: userMock.password,
        confirmPassword: userMock.password,
        actualPassword: userMock.password,
      });

      expect(result).toEqual(userMock);
      expect(jest.spyOn(service, 'update')).toHaveBeenCalledWith(userMock.id, {
        password: userMock.password,
      });
      expect(AwsSesServiceMock.sendEmail).toHaveBeenCalledWith({
        subject: 'Mindfit - Changed Password',
        template: Emails.CHANGE_PASSWORD,
        to: [userMock.email],
      });
    });
  });

  describe('update', () => {
    it('Should edit a specific User', async () => {
      UserRepositoryMock.update.mockReturnValue({
        ...userMock,
        name: 'TEST_NAME',
      });

      const result = await service.update(userMock.id, {
        name: 'TEST_NAME',
      });

      expect(result).toEqual({ ...userMock, name: 'TEST_NAME' });
      expect(UserRepositoryMock.update).toHaveBeenCalledWith(userMock.id, {
        name: 'TEST_NAME',
      });
    });

    it('Should edit multiple Users', async () => {
      UserRepositoryMock.updateMany.mockReturnValue([
        { ...userMock, name: 'TEST_NAME' },
        { ...userMock, name: 'TEST_NAME' },
      ]);

      const result = await service.updateMany([1, 2], {
        name: 'TEST_NAME',
      });

      expect(result).toEqual([
        { ...userMock, name: 'TEST_NAME' },
        { ...userMock, name: 'TEST_NAME' },
      ]);
      expect(UserRepositoryMock.updateMany).toHaveBeenCalledWith([1, 2], {
        name: 'TEST_NAME',
      });
    });

    it('should throw new mindfit error when host user is editing another user password', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(userSessionMock as any);
      await expect(
        service.updateUser(sessionMock, userMock.id, {
          password: 'CHANGING_PASSWORD',
        }),
      ).rejects.toThrowError(MindfitException);
    });

    it('should throw new mindfit error when host user is editing many users password', async () => {
      const secondUserMock = { ...userMock, id: 2 };
      await expect(
        service.updateManyUsers([userMock.id, secondUserMock.id], {
          password: 'CHANGING_PASSWORD',
        }),
      ).rejects.toThrowError(MindfitException);
    });
  });

  describe('delete', () => {
    it('Should delete a specific User', async () => {
      UserRepositoryMock.delete.mockReturnValue(1);

      const result = await service.delete(userMock.id);

      expect(result).toEqual(1);
      expect(UserRepositoryMock.delete).toHaveBeenCalledWith(userMock.id);
    });

    it('Should delete multiple Users', async () => {
      UserRepositoryMock.delete.mockReturnValue(2);

      const result = await service.delete([1, 2]);

      expect(result).toEqual(2);
      expect(UserRepositoryMock.delete).toHaveBeenCalledWith([1, 2]);
    });

    it('should throw mindfit exception when hostUser is deleting himself', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue({ ...userSessionMock, id: userMock.id } as any);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(userMock as any);

      await expect(
        service.deleteUser(sessionMock, userMock.id),
      ).rejects.toThrowError(MindfitException);
    });

    it('should throw mindfit exception when hostUser is array of users to delete', async () => {
      const secondUserMock = { ...userMock, id: 2 };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue({ ...userSessionMock, id: userMock.id } as any);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(userMock as any);

      await expect(
        service.deleteManyUsers(sessionMock, [userMock.id, secondUserMock.id]),
      ).rejects.toThrowError(MindfitException);
    });
  });
});
