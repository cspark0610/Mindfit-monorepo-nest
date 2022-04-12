import { Test, TestingModule } from '@nestjs/testing';
import { ChatsService } from 'src/subscriptions/services/chats.service';
import { ChatRepository } from 'src/subscriptions/repositories/chat.repository';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { JoinChatDto } from 'src/subscriptions/dto/joinChat.dto';

describe('ChatsService', () => {
  let service: ChatsService;
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

  const chatDataMock = {
    userIds: [userMock.id],
  };
  const chatDataFromMock = {
    users: [userMock],
  };

  const ChatRepositoryMock = {
    findOneBy: jest.fn().mockResolvedValue(ChatMock),
    create: jest.fn().mockResolvedValue(ChatMock),
    getParticipants: jest.fn().mockResolvedValue(ChatMock),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: ChatRepository,
          useValue: ChatRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<ChatsService>(ChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getChat', () => {
    it('should return a chat', async () => {
      ChatRepositoryMock.findOneBy();
      await expect(
        Promise.resolve(service.getChat(ChatMock.id)),
      ).resolves.toEqual(ChatMock);
    });
  });

  describe('createChat', () => {
    it('should return a chat', async () => {
      ChatRepositoryMock.create();
      jest
        .spyOn(JoinChatDto, 'from')
        .mockImplementation()
        .mockResolvedValue(chatDataFromMock);

      await expect(
        Promise.resolve(service.createChat(chatDataMock)),
      ).resolves.toEqual(ChatMock);
    });
  });

  describe('getChatParticipants', () => {
    it('should return a chat', async () => {
      ChatRepositoryMock.getParticipants();
      await expect(
        Promise.resolve(service.getParticipants(ChatMock.id)),
      ).resolves.toEqual(ChatMock);
    });
  });

  describe('joinToChat', () => {
    const updatedChatMock = { ...ChatMock, users: [userMock, userMock2] };
    it('should return a chat updated in users participants', async () => {
      ChatRepositoryMock.findOneBy();
      jest
        .spyOn(JoinChatDto, 'from')
        .mockImplementation()
        .mockResolvedValue(chatDataFromMock);

      ChatRepositoryMock.update.mockResolvedValue(updatedChatMock);

      await expect(
        Promise.resolve(service.joinToChat(ChatMock.id, chatDataMock)),
      ).resolves.toEqual(updatedChatMock);
    });
  });

  describe('removeUsersFromChat', () => {
    const initialChat = { ...ChatMock, users: [userMock, userMock2] };
    const updatedChatMock = { ...initialChat, users: [userMock] };
    it('should return a chat updated in users participants', async () => {
      ChatRepositoryMock.findOneBy.mockResolvedValue(initialChat);
      ChatRepositoryMock.update.mockResolvedValue(updatedChatMock);

      await expect(
        Promise.resolve(
          service.removeUsersFromChat({
            chatId: ChatMock.id,
            userIds: [userMock2.id],
          }),
        ),
      ).resolves.toEqual(updatedChatMock);
    });
  });
});
