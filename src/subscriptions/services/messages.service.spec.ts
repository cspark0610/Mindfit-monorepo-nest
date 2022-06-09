import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from 'src/subscriptions/services/messages.service';
import { MessageRepository } from 'src/subscriptions/repositories/message.repository';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/models/users.model';
import { Roles } from 'src/users/enums/roles.enum';
import { MessageReadByDto } from 'src/subscriptions/dto/messageReadBy.dto';
import { MessageDto } from 'src/subscriptions/dto/message.dto';

describe('MessagesService', () => {
  let service: MessagesService;
  const now = new Date();
  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: true,
    role: Roles.SUPER_USER,
  } as unknown as User;

  const userMock2 = {
    ...userMock,
    id: 2,
    role: Roles.STAFF,
  } as unknown as User;

  const ChatMock = {
    id: 1,
    messages: [],
    users: [userMock],
    createdAt: now,
    updatedAt: now,
  };
  const MessageMock = {
    id: 1,
    chat: ChatMock,
    readBy: [userMock],
    message: 'TEST_MESSAGE',
    createdAt: now,
    updatedAt: now,
  };
  const MessageReadByDtoMock = {
    readByIds: [userMock.id],
    messageId: MessageMock.id,
  };
  const MessageReadByFromDtoMock = {
    messageId: MessageMock.id,
    readBy: [userMock],
  };
  const MessageRepositoryMock = {
    findOneBy: jest.fn().mockResolvedValue(MessageMock),
    create: jest.fn().mockResolvedValue(MessageMock),
    update: jest.fn(),
  };
  const UsersServiceMock = {
    findOneBy: jest.fn().mockResolvedValue(userMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: MessageRepository,
          useValue: MessageRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();
    service = module.get<MessagesService>(MessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addUserRead', () => {
    const updatedMessageMock = {
      ...MessageMock,
      readBy: [userMock, userMock2],
    };
    it('should return a message uppdated in "readBy" field', async () => {
      MessageRepositoryMock.findOneBy();
      jest
        .spyOn(MessageReadByDto, 'from')
        .mockImplementation()
        .mockResolvedValue(MessageReadByFromDtoMock);
      MessageRepositoryMock.update.mockResolvedValue(updatedMessageMock);
      const result = await service.addUserRead(MessageReadByDtoMock);
      expect(result).toEqual(updatedMessageMock);
    });
  });

  describe('sendMessage', () => {
    const MessageDtoMock = {
      chatId: ChatMock.id,
      message: 'TEST_MESSAGE',
    };
    it('should return a message', async () => {
      UsersServiceMock.findOneBy();

      jest
        .spyOn(MessageDto, 'from')
        .mockImplementation()
        .mockResolvedValue(MessageMock);
      MessageRepositoryMock.create();
      const result = await service.sendMessage({
        userId: userMock.id,
        data: MessageDtoMock,
      });
      expect(result).toEqual(MessageMock);
    });
  });
});
